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
  ShieldCheck,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
      errors.amount = "Online payments must be at least ₹9. Please use UPI for smaller amounts."
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
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-ivory">
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-2xl"
        >
          <p className="section-eyebrow">Donate</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mt-3 mb-4">
            Support <span className="text-kallol-700">Kallol</span>
          </h1>
          <p className="text-lg text-ink-soft">
            Your generous donations help us preserve Bengali culture, maintain the Kali Mandir, and organize community
            events that bring our heritage to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* General Donation Form Section — first in the DOM and in the
              accessibility tree on mobile (no CSS reordering); right column
              on desktop via lg:order-2 */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:order-2"
          >
            <Card
              id="general-donation"
              className="scroll-mt-28 border-stone-line shadow-lg md:scroll-mt-32"
            >
              <CardHeader>
                {/* h2 (not the div-based CardTitle) so mobile heading order reads
                    General Donation before the specific-puja h3s below it */}
                <h2 className="text-2xl font-semibold leading-none tracking-tight text-ink">
                  General Donation
                </h2>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <Label className="text-base font-medium text-ink mb-4 block">Select Amount (INR)</Label>
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
                      <Label htmlFor="custom-amount" className="text-sm text-ink-soft">
                        Or enter custom amount
                      </Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-faint">₹</span>
                        <Input
                          id="custom-amount" aria-invalid={!!formErrors.amount} aria-describedby={formErrors.amount ? "amount-error" : undefined}
                          type="number"
                          placeholder="Enter amount"
                          className="pl-8 border-stone-line focus:border-kallol-700 focus:ring-kallol-700"
                          value={customAmount}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          name="amount" // This name attribute is for the total amount, not individual items
                        />
                      </div>
                      {formErrors.amount && (
                        <p id="amount-error" className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.amount}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-base font-medium text-ink mb-4 block">Payment Method</Label>
                    <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-kallol-50">
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
                              <h3 className="font-semibold text-ink mb-2">Pay Online Securely</h3>
                              <p className="text-sm text-ink-soft">
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
                              <h3 className="font-semibold text-ink mb-2">UPI Payment</h3>
                              <p className="text-sm text-ink-soft mb-4">Scan QR code or use UPI ID to make payment</p>
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
                              <p className="text-xs text-ink-mute">
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
                        <Label htmlFor="first-name" className="text-sm font-medium text-ink-soft">
                          First Name
                        </Label>
                        <Input
                          id="first-name" aria-invalid={!!formErrors.firstName} aria-describedby={formErrors.firstName ? "first-name-error" : undefined}
                          type="text"
                          className="mt-1 border-stone-line focus:border-kallol-700 focus:ring-kallol-700"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value)
                            setFormErrors((prev) => ({ ...prev, firstName: "" }))
                          }}
                          name="firstName" // Add name attribute for FormData
                          required
                        />
                        {formErrors.firstName && (
                          <p id="first-name-error" className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {formErrors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="last-name" className="text-sm font-medium text-ink-soft">
                          Last Name
                        </Label>
                        <Input
                          id="last-name" aria-invalid={!!formErrors.lastName} aria-describedby={formErrors.lastName ? "last-name-error" : undefined}
                          type="text"
                          className="mt-1 border-stone-line focus:border-kallol-700 focus:ring-kallol-700"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value)
                            setFormErrors((prev) => ({ ...prev, lastName: "" }))
                          }}
                          name="lastName" // Add name attribute for FormData
                          required
                        />
                        {formErrors.lastName && (
                          <p id="last-name-error" className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {formErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="gotra" className="text-sm font-medium text-ink-soft">
                        Gotra
                      </Label>
                      <Input
                        id="gotra" aria-invalid={!!formErrors.gotra} aria-describedby={formErrors.gotra ? "gotra-error" : undefined}
                        type="text"
                        className="mt-1 border-stone-line focus:border-kallol-700 focus:ring-kallol-700"
                        value={gotra}
                        onChange={(e) => {
                          setGotra(e.target.value)
                          setFormErrors((prev) => ({ ...prev, gotra: "" }))
                        }}
                        name="gotra" // Add name attribute for FormData
                        required
                      />
                      {formErrors.gotra && (
                        <p id="gotra-error" className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.gotra}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-ink-soft">
                        Phone Number
                      </Label>
                      <Input
                        id="phone" aria-invalid={!!formErrors.phoneNumber} aria-describedby={formErrors.phoneNumber ? "phone-error" : undefined}
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="mt-1 border-stone-line focus:border-kallol-700 focus:ring-kallol-700"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value)
                          setFormErrors((prev) => ({ ...prev, phoneNumber: "" }))
                        }}
                        name="phoneNumber" // Add name attribute for FormData
                        required
                      />
                      {formErrors.phoneNumber && (
                        <p id="phone-error" className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.phoneNumber}
                        </p>
                      )}
                    </div>
                    {paymentMethod === "online" && (
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-ink-soft">
                          Email (Optional)
                        </Label>
                        <Input
                          id="email" aria-invalid={!!formErrors.email} aria-describedby={formErrors.email ? "email-error" : undefined}
                          type="email"
                          placeholder="you@example.com"
                          className="mt-1 border-stone-line focus:border-kallol-700 focus:ring-kallol-700"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setFormErrors((prev) => ({ ...prev, email: "" }))
                          }}
                          name="email"
                        />
                        {formErrors.email && (
                          <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                    )}
                    <div>
                      <Label htmlFor="pan-number" className="text-sm font-medium text-ink-soft">
                        PAN Number{" "}
                        {getRawCurrentAmount() > 50000 ? (
                          <span className="text-red-500">*</span>
                        ) : (
                          <span className="text-ink-faint text-xs">(Required for donations above Rs. 50,000)</span>
                        )}
                      </Label>
                      <Input
                        id="pan-number" aria-invalid={!!formErrors.panNumber} aria-describedby={formErrors.panNumber ? "pan-number-error" : undefined}
                        type="text"
                        placeholder="ABCDE1234F"
                        className="mt-1 border-stone-line focus:border-kallol-700 focus:ring-kallol-700 uppercase"
                        value={panNumber}
                        onChange={(e) => {
                          setPanNumber(e.target.value.toUpperCase())
                          setFormErrors((prev) => ({ ...prev, panNumber: "" }))
                        }}
                        name="panNumber"
                      />
                      {formErrors.panNumber && (
                        <p id="pan-number-error" className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.panNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-ink-soft">
                        Message (Optional)
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Share why you're supporting Kallol..."
                        className="mt-1 border-stone-line focus:border-kallol-700 focus:ring-kallol-700"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        name="message" // Add name attribute for FormData
                      />
                    </div>
                  </div>

                  {/* Payment expectations, stated before confirmation (UX plan Phase 7).
                      Verified behavior: Instamojo redirect for online, downloadable
                      receipt on the thank-you page, site contact details for problems. */}
                  <div className="space-y-1.5 rounded-md border border-stone-line bg-kallol-50/60 p-4 text-sm leading-relaxed text-ink-soft">
                    {paymentMethod === "online" ? (
                      <p className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-kallol-700" aria-hidden="true" />
                        <span>
                          Payments are processed securely by our partner Instamojo. You&apos;ll be redirected to their
                          page to pay, then brought back to Kallol.
                        </span>
                      </p>
                    ) : null}
                    <p>A receipt will be available to download once your donation is confirmed.</p>
                    <p>
                      For payment problems, call{" "}
                      <a href="tel:+918655852917" className="link-editorial text-kallol-700">
                        +91-8655852917
                      </a>{" "}
                      or email{" "}
                      <a href="mailto:info@kallolmumbai.com" className="link-editorial text-kallol-700">
                        info@kallolmumbai.com
                      </a>
                      .
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-auto min-h-0 whitespace-normal text-center leading-snug bg-kallol-700 hover:bg-kallol-800 text-white py-3 px-4 text-base sm:text-lg shadow-md"
                    disabled={isSubmitting || getRawCurrentAmount() <= 0}
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
                  {getRawCurrentAmount() <= 0 && !isSubmitting && (
                    <p id="amount-hint" className="text-sm text-ink-mute">
                      Select or enter an amount to continue.
                    </p>
                  )}
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

          {/* Donation Impact Section */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">
              Donate Towards <span className="text-kallol-700">Specific Pujas</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pujaDonations.map((puja) => (
                <Card key={puja.id} className="border-stone-line hover:shadow-md transition-shadow h-full flex flex-col">
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center space-x-4 mb-4">
                      <Heart className="h-6 w-6 text-kallol-700" />
                      <h3 className="text-lg font-semibold text-ink">{puja.name}</h3>
                    </div>
                    <p className="text-ink-soft mb-4 flex-grow">{puja.description}</p>
                    <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white mt-auto self-start">
                      <Link href={`/donate/${puja.id}`}>
                        Donate to {puja.name}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
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
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">
            Recognition <span className="text-kallol-700">Donors</span>
          </h2>
          <p className="text-lg text-ink-soft max-w-2xl">
            Thank you to all our generous donors who have supported Kallol's cultural initiatives and temple
            maintenance.
          </p>
        </motion.div>
      </div>
    </main>
  )
}
