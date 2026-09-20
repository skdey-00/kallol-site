"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Heart,
  CreditCard,
  Smartphone,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Download,
  ArrowRight,
  ShieldCheck,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { submitDonation, submitOnlineDonation } from "@/actions/donations" // Import the Server Actions
import { cn } from "@/lib/utils"
import Link from "next/link"
import { pujaDonations } from "@/lib/puja-data" // Import pujaDonations

export default function DonatePage() {
  const [selectedAmounts, setSelectedAmounts] = useState<string[]>([])
  const [customAmount, setCustomAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("online")
  const [copied, setCopied] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [gotra, setGotra] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [panNumber, setPanNumber] = useState("")
  const [message, setMessage] = useState("")
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [receiptPdfBase64, setReceiptPdfBase64State] = useState<string | null>(null)
  const [generatedQrCodeToken, setGeneratedQrCodeToken] = useState<string | null>(null)

  const { toast } = useToast()

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const predefinedAmounts = ["₹500", "₹1000", "₹2500", "₹5000", "₹10000"]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAmountSelect = (amount: string) => {
    setSelectedAmounts((prevSelected) => {
      if (prevSelected.includes(amount)) {
        return prevSelected.filter((item) => item !== amount)
      } else {
        return [...prevSelected, amount]
      }
    })
    setCustomAmount("") // Clear custom amount
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmounts([]) // Clear multi-selected amounts
  }

  const getCurrentAmount = () => {
    if (customAmount) return `₹${Number.parseFloat(customAmount).toLocaleString("en-IN")}`
    if (selectedAmounts.length > 0) {
      const total = selectedAmounts.reduce((sum, amountStr) => {
        return sum + Number.parseFloat(amountStr.replace("₹", ""))
      }, 0)
      return `₹${total.toLocaleString("en-IN")}`
    }
    return "₹0"
  }

  const getRawCurrentAmount = () => {
    if (customAmount) return Number.parseFloat(customAmount)
    if (selectedAmounts.length > 0) {
      return selectedAmounts.reduce((sum, amountStr) => {
        return sum + Number.parseFloat(amountStr.replace("₹", ""))
      }, 0)
    }
    return 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { [key: string]: string } = {}

    if (!firstName.trim()) {
      errors.firstName = "First Name is required"
    }
    if (!lastName.trim()) {
      errors.lastName = "Last Name is required"
    }
    if (!gotra.trim()) {
      errors.gotra = "Gotra is required"
    }
    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Phone Number is required"
    }

    const finalAmount = getRawCurrentAmount()
    if (isNaN(finalAmount) || finalAmount <= 0) {
      errors.amount = "Please select or enter a valid donation amount."
    } else if (paymentMethod === "online" && finalAmount < 9) {
      errors.amount = "Online payments must be at least ₹9. Please use UPI or Paytm for smaller amounts."
    }

    // Email format check (optional, online payments only)
    if (paymentMethod === "online" && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address"
    }

    // PAN Number is required only if amount exceeds 50,000
    if (finalAmount > 50000 && !panNumber.trim()) {
      errors.panNumber = "PAN Number is required for donations above Rs. 50,000"
    }
    // Validate PAN format if provided (ABCDE1234F pattern)
    if (panNumber.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.trim().toUpperCase())) {
      errors.panNumber = "Invalid PAN format (expected: ABCDE1234F)"
    }

    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select a valid donation amount.",
        variant: "error",
      })
      return
    }

    setIsSubmitting(true)
    setReceiptPdfBase64State(null) // Clear previous receipt
    setGeneratedQrCodeToken(null) // Clear previous QR token

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    formData.set("totalAmount", finalAmount.toFixed(2)) // Use the validated finalAmount
    formData.set("paymentMethod", paymentMethod)
    formData.set("donationItems", JSON.stringify([])) // No specific puja items for general donation

    // Pay Online: create the payment request, then hand off to Instamojo's checkout.
    if (paymentMethod === "online") {
      const onlineResult = await submitOnlineDonation(formData)
      if (onlineResult.success && onlineResult.paymentUrl) {
        setIsRedirecting(true)
        window.location.href = onlineResult.paymentUrl
        return
      }
      toast({
        title: "Payment Could Not Be Started",
        description: onlineResult.message,
        variant: "error",
      })
      setIsSubmitting(false)
      return
    }

    const result = await submitDonation(formData)

    if (result.success) {
      toast({
        title: "Donation Confirmed!",
        description: result.message,
        variant: "success",
      })
      // Set the receipt PDF base64
      if (result.receiptPdfBase64) {
        setReceiptPdfBase64State(result.receiptPdfBase64)
      }
      if (result.qrCodeToken) {
        // Store the QR code token
        setGeneratedQrCodeToken(result.qrCodeToken)
      }
      // Reset form fields
      setSelectedAmounts([])
      setCustomAmount("")
      setFirstName("")
      setLastName("")
      setGotra("")
      setPhoneNumber("")
      setEmail("")
      setPanNumber("")
      setMessage("")
    } else {
      toast({
        title: "Donation Failed",
        description: result.message,
        variant: "error",
      })
    }
    setIsSubmitting(false)
  }

  const handleDownloadReceipt = () => {
    if (receiptPdfBase64) {
      const byteCharacters = atob(receiptPdfBase64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Kallol_Donation_Receipt_${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url) // Clean up the URL object
      toast({
        title: "Receipt Downloaded",
        description: "Your donation receipt has been downloaded.",
        variant: "default",
      })
    }
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Support <span className="text-kallol-700">Kallol</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Your generous donations help us preserve Bengali culture, maintain the Kali Mandir, and organize community
            events that bring our heritage to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Donation Impact Section */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Donate Towards <span className="text-kallol-700">Specific Pujas</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pujaDonations.map((puja) => (
                <Card key={puja.id} className="border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col">
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center space-x-4 mb-4">
                      <Heart className="h-6 w-6 text-kallol-700" />
                      <h3 className="text-lg font-semibold text-gray-900">{puja.name}</h3>
                    </div>
                    <p className="text-gray-700 mb-4 flex-grow">{puja.description}</p>
                    <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white mt-auto self-start">
                      <Link href={`/donate/${puja.id}`}>
                        Donate to {puja.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* General Donation Form Section */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-900">General Donation</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <Label className="text-base font-medium text-gray-900 mb-4 block">Select Amount (INR)</Label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {predefinedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          className={cn(
                            "h-auto py-3 transition-colors",
                            selectedAmounts.includes(amount)
                              ? "bg-kallol-700 hover:bg-kallol-800 text-white"
                              : "border-2 border-kallol-700 text-kallol-700 hover:bg-kallol-50 bg-transparent",
                          )}
                          onClick={() => handleAmountSelect(amount)}
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                    <div>
                      <Label htmlFor="custom-amount" className="text-sm text-gray-700">
                        Or enter custom amount
                      </Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <Input
                          id="custom-amount"
                          type="number"
                          placeholder="Enter amount"
                          className="pl-8 border-gray-300 focus:border-kallol-700 focus:ring-kallol-700"
                          value={customAmount}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          name="amount" // This name attribute is for the total amount, not individual items
                        />
                      </div>
                      {formErrors.amount && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.amount}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-base font-medium text-gray-900 mb-4 block">Payment Method</Label>
                    <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                        <TabsTrigger
                          value="online"
                          className="data-[state=active]:bg-kallol-700 data-[state=active]:text-white"
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Pay Online
                        </TabsTrigger>
                        <TabsTrigger
                          value="upi"
                          className="data-[state=active]:bg-kallol-700 data-[state=active]:text-white"
                        >
                          <Smartphone className="h-4 w-4 mr-2" />
                          UPI
                        </TabsTrigger>
                        </TabsList>

                      <TabsContent value="online" className="mt-4">
                        <Card className="border-kallol-200 bg-kallol-50">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-kallol-700" />
                              <h3 className="font-semibold text-gray-900 mb-2">Pay Online Securely</h3>
                              <p className="text-sm text-gray-700">
                                Pay securely with UPI, cards, netbanking or wallets via our payment partner Instamojo.
                                You&apos;ll be redirected to complete the payment.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="upi" className="mt-4">
                        <Card className="border-kallol-200 bg-kallol-50">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <QrCode className="h-16 w-16 mx-auto mb-4 text-kallol-700" />
                              <h3 className="font-semibold text-gray-900 mb-2">UPI Payment</h3>
                              <p className="text-sm text-gray-700 mb-4">Scan QR code or use UPI ID to make payment</p>
                              <div className="bg-white p-3 rounded-md border border-kallol-200 mb-4">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-sm">kallol8655852917@iob</span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard("kallol8655852917@iob")}
                                    className="border-kallol-700 text-kallol-700 hover:bg-kallol-50"
                                  >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600">
                                Amount: <span className="font-semibold">{getCurrentAmount()}</span>
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                                          </Tabs>
                  </div>

                  {/* Donor Information */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first-name" className="text-sm font-medium text-gray-700">
                          First Name
                        </Label>
                        <Input
                          id="first-name"
                          type="text"
                          className="mt-1 border-gray-300 focus:border-kallol-700 focus:ring-kallol-700"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value)
                            setFormErrors((prev) => ({ ...prev, firstName: "" }))
                          }}
                          name="firstName" // Add name attribute for FormData
                          required
                        />
                        {formErrors.firstName && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {formErrors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="last-name" className="text-sm font-medium text-gray-700">
                          Last Name
                        </Label>
                        <Input
                          id="last-name"
                          type="text"
                          className="mt-1 border-gray-300 focus:border-kallol-700 focus:ring-kallol-700"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value)
                            setFormErrors((prev) => ({ ...prev, lastName: "" }))
                          }}
                          name="lastName" // Add name attribute for FormData
                          required
                        />
                        {formErrors.lastName && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {formErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="gotra" className="text-sm font-medium text-gray-700">
                        Gotra
                      </Label>
                      <Input
                        id="gotra"
                        type="text"
                        className="mt-1 border-gray-300 focus:border-kallol-700 focus:ring-kallol-700"
                        value={gotra}
                        onChange={(e) => {
                          setGotra(e.target.value)
                          setFormErrors((prev) => ({ ...prev, gotra: "" }))
                        }}
                        name="gotra" // Add name attribute for FormData
                        required
                      />
                      {formErrors.gotra && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.gotra}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="mt-1 border-gray-300 focus:border-kallol-700 focus:ring-kallol-700"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value)
                          setFormErrors((prev) => ({ ...prev, phoneNumber: "" }))
                        }}
                        name="phoneNumber" // Add name attribute for FormData
                        required
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.phoneNumber}
                        </p>
                      )}
                    </div>
                    {paymentMethod === "online" && (
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email (Optional)
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="mt-1 border-gray-300 focus:border-kallol-700 focus:ring-kallol-700"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setFormErrors((prev) => ({ ...prev, email: "" }))
                          }}
                          name="email"
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                    )}
                    <div>
                      <Label htmlFor="pan-number" className="text-sm font-medium text-gray-700">
                        PAN Number{" "}
                        {getRawCurrentAmount() > 50000 ? (
                          <span className="text-red-500">*</span>
                        ) : (
                          <span className="text-gray-400 text-xs">(Required for donations above Rs. 50,000)</span>
                        )}
                      </Label>
                      <Input
                        id="pan-number"
                        type="text"
                        placeholder="ABCDE1234F"
                        className="mt-1 border-gray-300 focus:border-kallol-700 focus:ring-kallol-700 uppercase"
                        value={panNumber}
                        onChange={(e) => {
                          setPanNumber(e.target.value.toUpperCase())
                          setFormErrors((prev) => ({ ...prev, panNumber: "" }))
                        }}
                        name="panNumber"
                      />
                      {formErrors.panNumber && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.panNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Message (Optional)
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Share why you're supporting Kallol..."
                        className="mt-1 border-gray-300 focus:border-kallol-700 focus:ring-kallol-700"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        name="message" // Add name attribute for FormData
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-auto min-h-0 whitespace-normal text-center leading-snug bg-kallol-700 hover:bg-kallol-800 text-white py-3 px-4 text-base sm:text-lg shadow-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting || isRedirecting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {isRedirecting ? "Redirecting to secure payment..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        <Heart className="h-5 w-5 mr-2" />
                        Confirm Donation of {getCurrentAmount()}
                      </>
                    )}
                  </Button>
                </form>

                {receiptPdfBase64 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-6 p-4 bg-green-100 border border-green-200 rounded-md text-center"
                  >
                    <p className="text-green-800 font-medium mb-3">Your donation was successful!</p>
                    <Button onClick={handleDownloadReceipt} className="bg-green-700 hover:bg-green-800 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                    {generatedQrCodeToken && (
                      <p className="text-sm text-green-700 mt-2">
                        (QR Code Token: <code className="font-mono">{generatedQrCodeToken}</code>)
                      </p>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recognition Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Recognition <span className="text-kallol-700">Donors</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Thank you to all our generous donors who have supported Kallol's cultural initiatives and temple
            maintenance.
          </p>
        </motion.div>
      </div>
    </main>
  )
}
