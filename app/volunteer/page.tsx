"use client"

import { Input } from "@/components/ui/input"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  CheckCircle,
  ListTodo,
  Calendar,
  Users,
  Download,
  FileText,
  QrCode,
  Scan,
  XCircle,
  Loader2,
  Camera,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { validateQrCode } from "@/actions/qr-validation"

// Dynamically import QrScanner to ensure it's only loaded on the client
import dynamic from "next/dynamic"

const QrScanner = dynamic(() => import("react-qr-reader").then((mod) => mod.QrReader), {
  ssr: false, // This component should only be rendered on the client side
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
      <Loader2 className="h-8 w-8 animate-spin text-kallol-700" />
      <p className="ml-2 text-gray-600">Loading scanner...</p>
    </div>
  ),
})

export default function VolunteerPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("tasks")

  // QR Scanner states
  const [scannedToken, setScannedToken] = useState<string>("")
  const [scanResult, setScanResult] = useState<{
    status: "idle" | "scanning" | "valid" | "invalid" | "used" | "error"
    message: string
    donationDetails?: any
  }>({ status: "idle", message: "Scan a QR code or enter a token to validate." })
  const [isProcessingScan, setIsProcessingScan] = useState(false)
  const [showScanner, setShowScanner] = useState(false) // State to toggle scanner visibility
  const [cameraError, setCameraError] = useState<string | null>(null) // State for camera errors

  useEffect(() => {
    if (!isLoading && (!user || (user.membershipType !== "volunteer" && user.email !== "admin@kallol.org"))) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const volunteerTasks = [
    {
      id: 1,
      title: "Event Setup & Decoration",
      description: "Assist with setting up stages, seating, and decorations for upcoming cultural events.",
      status: "pending",
      dueDate: "2025-07-20",
    },
    {
      id: 2,
      title: "Guest Registration & Welcome",
      description: "Help with welcoming guests and managing registration desks during large gatherings.",
      status: "pending",
      dueDate: "2025-08-01",
    },
    {
      id: 3,
      title: "Food Distribution & Management",
      description: "Support in organizing and distributing prasad and meals during pujas and festivals.",
      status: "pending",
      dueDate: "2025-08-15",
    },
    {
      id: 4,
      title: "Cleanup & Logistics",
      description: "Assist with post-event cleanup and managing logistics for equipment and supplies.",
      status: "completed",
      dueDate: "2025-06-30",
    },
    {
      id: 5,
      title: "Social Media Promotion",
      description: "Help promote Kallol events and initiatives on various social media platforms.",
      status: "pending",
      dueDate: "2025-07-25",
    },
  ]

  const meetingMinutes = [
    {
      id: 7,
      date: "2024-09-01",
      title: "Durga Puja Planning Meeting 2024",
      attendees: 25,
      topics: ["Pandal Design", "Cultural Program Schedule", "Volunteer Assignments", "Prasad Preparation"],
      summary:
        "Detailed planning for Durga Puja 2024, including logistics, cultural performances, and volunteer roles. Key decisions were made regarding volunteer shifts and responsibilities.",
      type: "general",
      downloadUrl: "#",
    },
    {
      id: 6,
      date: "2024-10-10",
      title: "Durga Puja Review Meeting",
      attendees: 38,
      topics: ["Event Success Review", "Financial Report", "Feedback Collection", "Improvements for Next Year"],
      summary:
        "Reviewed the successful Durga Puja celebration, analyzed financial performance, and collected feedback for future improvements. Volunteer feedback was highly positive.",
      type: "general",
      downloadUrl: "#",
    },
  ]

  const handleValidation = useCallback(
    async (token: string) => {
      if (!token.trim()) {
        setScanResult({ status: "invalid", message: "No QR code data detected." })
        return
      }

      setIsProcessingScan(true)
      setScanResult({ status: "scanning", message: "Validating QR code..." })
      setScannedToken(token) // Update input field with scanned token

      try {
        const result = await validateQrCode(token.trim())
        if (result.success) {
          setScanResult({
            status: "valid",
            message: result.message,
            donationDetails: result.donation,
          })
          toast({
            title: "QR Code Validated",
            description: result.message,
            variant: "success",
          })
        } else {
          setScanResult({
            status: result.message.includes("already used") ? "used" : "invalid",
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

  const handleScanResult = (result: any, error: any) => {
    if (result && result.text) {
      handleValidation(result.text)
      setShowScanner(false) // Hide scanner after successful scan
    } else if (error) {
      // Check if the error object is empty or just the "No QR code found" message
      const isErrorObjectEmpty = typeof error === "object" && error !== null && Object.keys(error).length === 0
      const isNoQrCodeFoundMessage = typeof error === "string" && error === "No QR code found"
      const isErrorMessageProperty = typeof error === "object" && error !== null && error.message === "No QR code found"

      if (!isErrorObjectEmpty && !isNoQrCodeFoundMessage && !isErrorMessageProperty) {
        // Log only if it's a non-empty error object or a different error message
        console.error("QR Scanner Decoding Error:", error)
      }
    }
  }

  const handleCameraError = (error: any) => {
    console.error("Camera Error:", error)
    if (error.name === "NotAllowedError") {
      setCameraError("Camera access denied. Please grant camera permissions in your browser settings.")
    } else if (error.name === "NotFoundError") {
      setCameraError("No camera found. Please ensure a camera is connected and enabled.")
    } else {
      setCameraError(`An unexpected camera error occurred: ${error.message}`)
    }
    setScanResult({ status: "error", message: "Camera error. Please check permissions or try again." })
    setShowScanner(false) // Hide scanner on critical error
  }

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
            <ListTodo className="h-8 w-8 text-kallol-700 mr-3" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Volunteer <span className="text-kallol-700">Hub</span>
            </h1>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Welcome, {user.name}! Here you can find your assigned tasks and important meeting minutes for upcoming
            events.
          </p>
          <Badge className="mt-4 bg-kallol-100 text-kallol-800 border-kallol-200 border">
            Thank you for your dedication!
          </Badge>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="tasks" className="text-lg py-3">
              <ListTodo className="h-5 w-5 mr-2" />
              Your Tasks
            </TabsTrigger>
            <TabsTrigger value="minutes" className="text-lg py-3">
              <FileText className="h-5 w-5 mr-2" />
              Meeting Minutes
            </TabsTrigger>
            <TabsTrigger value="qr-validation" className="text-lg py-3">
              <QrCode className="h-5 w-5 mr-2" />
              QR Validation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            {/* Volunteer Tasks Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Your <span className="text-kallol-700">Tasks</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {volunteerTasks.map((task) => (
                  <Card
                    key={task.id}
                    className={`border-gray-200 ${
                      task.status === "completed" ? "bg-green-50 border-green-200" : "bg-white"
                    } hover:shadow-md transition-shadow`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                        <Badge
                          className={
                            task.status === "completed"
                              ? "bg-green-100 text-green-800 border-green-200 border"
                              : "bg-blue-100 text-blue-800 border-blue-200 border"
                          }
                        >
                          {task.status === "completed" ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{task.description}</p>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Due: {new Date(task.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                      </div>
                      {task.status === "pending" && (
                        <Button size="sm" className="mt-4 bg-kallol-700 hover:bg-kallol-800 text-white">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Complete
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="minutes">
            {/* Durga Puja Meeting Minutes Section */}
            <motion.div initial="hidden" animate="visible" variants={staggerChildren} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Durga Puja <span className="text-kallol-700">Meeting Minutes</span>
              </h2>
              <div className="space-y-6">
                {meetingMinutes.length === 0 ? (
                  <Card className="border-gray-200 bg-gray-50">
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Durga Puja Minutes Found</h3>
                      <p className="text-gray-600">Check back later for updates on Durga Puja planning.</p>
                    </CardContent>
                  </Card>
                ) : (
                  meetingMinutes.map((minute) => (
                    <motion.div key={minute.id} variants={fadeIn}>
                      <Card className="border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <CardTitle className="text-xl text-gray-900">{minute.title}</CardTitle>
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">
                                  General Meeting
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(minute.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {minute.attendees} attendees
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-kallol-700 text-kallol-700 hover:bg-kallol-50 mt-4 md:mt-0 bg-transparent"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Topics Discussed:</h4>
                            <div className="flex flex-wrap gap-2">
                              {minute.topics.map((topic, index) => (
                                <Badge key={index} className="bg-gray-100 text-gray-800 border-gray-200 border text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Summary:</h4>
                            <p className="text-gray-700">{minute.summary}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="qr-validation">
            {/* QR Code Validation Section */}
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
                  </p>

                  <div className="flex flex-col gap-4">
                    {/* QR Scanner Section */}
                    {!showScanner && (
                      <Button
                        onClick={() => {
                          setShowScanner(true)
                          setCameraError(null) // Clear previous errors
                          setScanResult({ status: "idle", message: "Scan a QR code or enter a token to validate." })
                        }}
                        className="bg-kallol-700 hover:bg-kallol-800 text-white"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Open QR Scanner
                      </Button>
                    )}

                    {showScanner && (
                      <div className="relative w-full h-64 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                        {cameraError ? (
                          <div className="text-center text-red-600 p-4 flex flex-col items-center">
                            <AlertTriangle className="h-8 w-8 mb-2" />
                            <p className="font-semibold">Camera Error:</p>
                            <p className="text-sm">{cameraError}</p>
                            <Button
                              variant="outline"
                              onClick={() => setShowScanner(false)}
                              className="mt-4 border-red-700 text-red-700 hover:bg-red-50"
                            >
                              Close Scanner
                            </Button>
                          </div>
                        ) : (
                          <>
                            <QrScanner
                              onResult={handleScanResult}
                              onError={handleCameraError}
                              constraints={{ facingMode: "environment" }} // Prefer rear camera
                              scanDelay={500} // Delay between scans
                              containerStyle={{ width: "100%", height: "100%" }}
                              videoStyle={{ objectFit: "cover" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-48 h-48 border-4 border-kallol-700 rounded-lg animate-pulse-border"></div>
                            </div>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setShowScanner(false)}
                              className="absolute top-2 right-2 z-10"
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Close
                            </Button>
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
                Your contributions are invaluable. If you have any questions about your tasks, need assistance, or have
                feedback, please reach out to the volunteer coordinator.
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
