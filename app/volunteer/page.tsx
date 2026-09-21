"use client"

import { Input } from "@/components/ui/input"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, QrCode, Scan, XCircle, Loader2, Camera, AlertTriangle, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { validateQrCode } from "@/actions/qr-validation"
import jsQR from "jsqr"

export default function VolunteerPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("qr-validation")

  // QR Scanner states
  const [scannedToken, setScannedToken] = useState<string>("")
  const [scanResult, setScanResult] = useState<{
    status: "idle" | "scanning" | "valid" | "invalid" | "used" | "error"
    message: string
    donationDetails?: any
  }>({ status: "idle", message: "Scan a QR code or enter a token to validate." })
  const [isProcessingScan, setIsProcessingScan] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [pendingToken, setPendingToken] = useState<string | null>(null)
  const [photoCountdown, setPhotoCountdown] = useState<number>(0)
  const [scannerSupported, setScannerSupported] = useState(true)

  // Refs for camera control
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const hasScannedRef = useRef(false) // Lock to prevent double-scans
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isLoading && (!user || (user.membershipType !== "volunteer" && user.email !== "admin@kallol.org"))) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Check if camera API is available (required for any scanning).
  // BarcodeDetector is NOT required, jsQR is the fallback.
  // The only thing that kills camera access is a non-secure context
  // (HTTP that isn't localhost/127.0.0.1).
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasCamera =
        !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function")
      if (!hasCamera) {
        setScannerSupported(false)
      }
    }
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Capture a frame from the live camera video element
  const capturePhotoFromVideo = (): string | null => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return null
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    ctx.drawImage(video, 0, 0)
    return canvas.toDataURL("image/jpeg", 0.7)
  }

  const handleValidation = useCallback(
    async (token: string, photoBase64?: string | null) => {
      if (!token.trim()) {
        setScanResult({ status: "invalid", message: "No QR code data detected." })
        return
      }

      setIsProcessingScan(true)
      setScanResult({ status: "scanning", message: "Validating QR code..." })
      setScannedToken(token)

      try {
        const result = await validateQrCode(token.trim(), photoBase64 || undefined)
        if (result.success) {
          setScanResult({
            status: "valid",
            message: result.message,
            donationDetails: result.scannedItem
              ? { ...result.donation, purpose: result.scannedItem.purpose, category: result.scannedItem.category }
              : result.donation,
          })
          toast({
            title: "QR Code Validated",
            description: photoBase64 ? result.message + " (Photo captured for verification)" : result.message,
            variant: "success",
          })
        } else {
          setScanResult({
            status: result.message.includes("fully used") ? "used" : "invalid",
            message: result.message,
          })
          toast({
            title: "QR Code Invalid",
            description: result.message,
            variant: "error",
          })
        }
      } catch (error) {
        console.error("Error validating QR code:", error)
        setScanResult({ status: "error", message: "An error occurred during validation." })
        toast({
          title: "Validation Error",
          description: "Could not validate QR code due to a server error.",
          variant: "error",
        })
      } finally {
        setIsProcessingScan(false)
      }
    },
    [toast],
  )

  // Start a 3-second countdown to capture a verification photo after QR is detected
  const startPhotoCountdown = useCallback(
    (token: string) => {
      setPendingToken(token)
      setPhotoCountdown(3)

      // Clear any existing countdown
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }

      countdownIntervalRef.current = setInterval(() => {
        setPhotoCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current)
              countdownIntervalRef.current = null
            }
            // Time's up - capture the photo
            const photo = capturePhotoFromVideo()
            setCapturedPhoto(photo)
            // Stop the camera
            stopCamera()
            setShowScanner(false)
            // Validate with photo
            setTimeout(() => handleValidation(token, photo), 200)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    },
    [handleValidation],
  )

  // Stop the camera stream and scanning loop
  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  // Start the camera and QR scanning loop
  const startCamera = useCallback(async () => {
    hasScannedRef.current = false // Reset scan lock
    setCameraError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      // Start scanning loop, BarcodeDetector if available, jsQR fallback otherwise
      const startScanning = async () => {
        // --- Fast path: native BarcodeDetector (Chrome, Edge, Safari) ---
        if ("BarcodeDetector" in window) {
          // @ts-ignore - BarcodeDetector is not in TypeScript types yet
          const detector = new window.BarcodeDetector({
            formats: ["qr_code"],
          })

          const scanLoop = async () => {
            if (!videoRef.current || hasScannedRef.current) return

            try {
              const barcodes = await detector.detect(videoRef.current)
              if (barcodes && barcodes.length > 0 && !hasScannedRef.current) {
                const qrText = barcodes[0].rawValue
                if (qrText) {
                  hasScannedRef.current = true
                  startPhotoCountdown(qrText)
                  return
                }
              }
            } catch {
              // Detection errors are normal (e.g., no barcode in frame), just continue
            }

            if (!hasScannedRef.current) {
              rafRef.current = requestAnimationFrame(scanLoop)
            }
          }

          scanLoop()
          return
        }

        // --- Fallback path: jsQR (Firefox, older browsers, any camera-enabled browser) ---
        const scanCanvas = document.createElement("canvas")
        const scanCtx = scanCanvas.getContext("2d", { willReadFrequently: true })
        if (!scanCtx) {
          setCameraError("Unable to initialize QR scanner. Please enter the token manually below.")
          return
        }

        const scanLoop = () => {
          if (!videoRef.current || hasScannedRef.current) return

          const video = videoRef.current
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            scanCanvas.width = video.videoWidth
            scanCanvas.height = video.videoHeight
            scanCtx.drawImage(video, 0, 0, scanCanvas.width, scanCanvas.height)

            const imageData = scanCtx.getImageData(0, 0, scanCanvas.width, scanCanvas.height)
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            })

            if (code && code.data && !hasScannedRef.current) {
              hasScannedRef.current = true
              startPhotoCountdown(code.data)
              return
            }
          }

          if (!hasScannedRef.current) {
            rafRef.current = requestAnimationFrame(scanLoop)
          }
        }

        scanLoop()
      }

      startScanning()
    } catch (error: any) {
      console.error("Camera Error:", error)
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setCameraError(
          "Camera access denied. Please grant camera permissions in your browser settings and try again.",
        )
      } else if (error.name === "NotFoundError") {
        setCameraError("No camera found on this device. Please ensure a camera is connected and enabled.")
      } else if (error.name === "NotReadableError") {
        setCameraError("Camera is already in use or not accessible. Please close other apps using the camera.")
      } else if (error.name === "OverconstrainedError") {
        setCameraError("Camera constraints not supported. Try a different device or browser.")
      } else {
        setCameraError(`An unexpected camera error occurred: ${error.message || error.name}.`)
      }
    }
  }, [startPhotoCountdown])

  // Start/stop camera when scanner visibility changes
  useEffect(() => {
    if (showScanner && scannerSupported) {
      startCamera()
    } else {
      stopCamera()
    }

    // Cleanup on unmount
    return () => {
      stopCamera()
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [showScanner, scannerSupported, startCamera, stopCamera])

  if (isLoading) {
    return (
      <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kallol-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  if (!user || (user.membershipType !== "volunteer" && user.email !== "admin@kallol.org")) {
    return null
  }

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <QrCode className="h-8 w-8 text-kallol-700 mr-3" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Volunteer <span className="text-kallol-700">Hub</span>
            </h1>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Welcome, {user.name}! Here you can validate QR codes for donations.
          </p>
          <Badge className="mt-4 bg-kallol-100 text-kallol-800 border-kallol-200 border">
            Thank you for your dedication!
          </Badge>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-1 mb-8">
            <TabsTrigger value="qr-validation" className="text-lg py-3">
              <QrCode className="h-5 w-5 mr-2" />
              QR Validation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr-validation">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                QR Code <span className="text-kallol-700">Validation</span>
              </h2>
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 flex items-center">
                    <Scan className="h-5 w-5 mr-2" />
                    Validate Donation QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Use your device's camera to scan the QR code on the donation receipt, or manually enter the token.
                    <br />
                    <span className="text-sm text-kallol-700 font-medium">
                      <Camera className="inline h-4 w-4 mr-1" />
                      A verification photo will be captured automatically after scanning.
                    </span>
                  </p>

                  <div className="flex flex-col gap-4">
                    {/* QR Scanner Section */}
                    {!showScanner && (
                      <Button
                        onClick={() => {
                          setShowScanner(true)
                          setCameraError(null)
                          setScanResult({ status: "idle", message: "Scan a QR code or enter a token to validate." })
                          setCapturedPhoto(null)
                          setPendingToken(null)
                          setPhotoCountdown(0)
                          hasScannedRef.current = false
                        }}
                        className="bg-kallol-700 hover:bg-kallol-800 text-white"
                        disabled={!scannerSupported}
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Open QR Scanner
                      </Button>
                    )}

                    {!scannerSupported && (
                      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
                        <AlertTriangle className="inline h-4 w-4 mr-1" />
                        Camera access requires a secure connection (HTTPS or localhost). If you're
                        opening this site via an IP address over HTTP, camera features won't work.
                        You can still enter the token manually below.
                      </p>
                    )}

                    {showScanner && (
                      <div className="relative w-full h-80 bg-black rounded-md overflow-hidden">
                        {/* Hidden canvas for frame capture */}
                        <canvas ref={canvasRef} className="hidden" />

                        {cameraError ? (
                          <div className="text-center text-red-600 p-4 flex flex-col items-center justify-center h-full">
                            <AlertTriangle className="h-8 w-8 mb-2" />
                            <p className="font-semibold">Camera Error:</p>
                            <p className="text-sm">{cameraError}</p>
                            <Button
                              variant="outline"
                              onClick={() => {
                                stopCamera()
                                setShowScanner(false)
                              }}
                              className="mt-4 border-red-700 text-red-700 hover:bg-red-50"
                            >
                              Close Scanner
                            </Button>
                          </div>
                        ) : (
                          <>
                            {/* Live camera video -- fills the entire box */}
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-full object-cover"
                              style={{ display: "block" }}
                            />

                            {/* Scan target frame overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                              <div className="w-56 h-56 border-4 border-white/80 rounded-2xl shadow-lg">
                                <div className="w-full h-full border-2 border-kallol-500/60 rounded-xl"></div>
                              </div>
                            </div>

                            {/* Helper text */}
                            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-sm bg-black/60 px-4 py-1 rounded-full pointer-events-none z-10">
                              Align QR code within the frame
                            </p>

                            {/* Close button */}
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                stopCamera()
                                setShowScanner(false)
                              }}
                              className="absolute top-2 right-2 z-10"
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Close
                            </Button>

                            {/* Photo Countdown Overlay */}
                            {photoCountdown > 0 && (
                              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
                                <p className="text-white text-lg font-semibold mb-2">
                                  Point camera at person for verification
                                </p>
                                <div className="text-white text-7xl font-bold">{photoCountdown}</div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Manual Input Fallback */}
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Or enter QR code token manually"
                        value={scannedToken}
                        onChange={(e) => {
                          setScannedToken(e.target.value)
                          setScanResult({ status: "idle", message: "Scan a QR code or enter a token to validate." })
                        }}
                        className="flex-grow"
                        disabled={isProcessingScan || showScanner}
                      />
                      <Button
                        onClick={() => handleValidation(scannedToken)}
                        disabled={isProcessingScan || !scannedToken.trim()}
                      >
                        {isProcessingScan ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scan className="h-4 w-4" />}
                        <span className="ml-2">Validate</span>
                      </Button>
                    </div>
                  </div>

                  {scanResult.status !== "idle" && (
                    <div
                      className={`p-4 rounded-md flex items-start space-x-3 ${
                        scanResult.status === "valid"
                          ? "bg-green-100 border border-green-200 text-green-800"
                          : scanResult.status === "invalid"
                            ? "bg-red-100 border border-red-200 text-red-800"
                            : scanResult.status === "used"
                              ? "bg-yellow-100 border border-yellow-200 text-yellow-800"
                              : scanResult.status === "error"
                                ? "bg-red-100 border border-red-200 text-red-800"
                                : "bg-blue-100 border border-blue-200 text-blue-800"
                      }`}
                    >
                      {scanResult.status === "valid" && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
                      {(scanResult.status === "invalid" ||
                        scanResult.status === "used" ||
                        scanResult.status === "error") && <XCircle className="h-5 w-5 flex-shrink-0" />}
                      {scanResult.status === "scanning" && <Loader2 className="h-5 w-5 animate-spin flex-shrink-0" />}
                      <div>
                        <p className="font-semibold">{scanResult.message}</p>
                        {capturedPhoto && (
                          <div className="mt-2 flex items-center gap-2">
                            <img
                              src={capturedPhoto}
                              alt="Verification photo"
                              className="w-20 h-20 object-cover rounded-md border border-gray-300"
                            />
                            <p className="text-xs text-gray-600 flex items-center">
                              <ImageIcon className="h-3 w-3 mr-1" />
                              Verification photo captured
                            </p>
                          </div>
                        )}
                        {scanResult.donationDetails && (
                          <div className="mt-2 text-sm">
                            <p>
                              <strong>Donor:</strong> {scanResult.donationDetails.firstName}{" "}
                              {scanResult.donationDetails.lastName}
                            </p>
                            <p>
                              <strong>Amount:</strong> ₹{scanResult.donationDetails.amount}
                            </p>
                            {scanResult.donationDetails.purpose && (
                              <p>
                                <strong>Purpose:</strong> {scanResult.donationDetails.purpose}
                              </p>
                            )}
                            {scanResult.donationDetails.category && (
                              <p>
                                <strong>Category:</strong> {scanResult.donationDetails.category}
                              </p>
                            )}
                            <p className="text-xs text-gray-600 mt-1">
                              Donated on: {new Date(scanResult.donationDetails.timestamp).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-kallol-50 p-8">
            <CardContent className="p-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Have Questions or Feedback?</h2>
              <p className="text-gray-700 max-w-2xl mx-auto mb-6">
                Your contributions are invaluable. If you have any questions or need assistance with QR validation,
                please reach out to the volunteer coordinator.
              </p>
              <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white shadow-md">
                <a href="mailto:volunteer@kallol.org">Contact Coordinator</a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
