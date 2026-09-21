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
  X,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { submitDonation, submitOnlineDonation } from "@/actions/donations"
import { cn } from "@/lib/utils"
import { pujaDonations, type DonationItem, type PujaDonationCategory, type OfferingItem } from "@/lib/puja-data" // Import types and data

// Shared donation flow for one puja, renderable standalone (/donate/[pujaId])
// or embedded on that puja page (e.g. /amavasya-puja).
export function PujaDonate({ puja }: { puja: PujaDonationCategory }) {

  const [selectedPujaItems, setSelectedPujaItems] = useState<DonationItem[]>([])
  const [selectedOfferings, setSelectedOfferings] = useState<OfferingItem[]>([])
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

  const handlePujaDonationSelect = (amount: number, purpose: string, category: string, date?: string) => {
    const newItem: DonationItem = { purpose, category, amount, date }
    const wasSelected = selectedPujaItems.some(
      (item) => item.purpose === newItem.purpose && item.category === newItem.category && item.date === newItem.date,
    )
    setSelectedPujaItems((prevItems) => {
      const exists = prevItems.some(
        (item) => item.purpose === newItem.purpose && item.category === newItem.category && item.date === newItem.date,
      )
      if (exists) {
        return prevItems.filter(
          (item) =>
            !(item.purpose === newItem.purpose && item.category === newItem.category && item.date === newItem.date),
        )
      } else {
        return [...prevItems, newItem]
      }
    })
    // Selecting a new puja auto-scrolls to the confirm-donation form at the
    // bottom so the donor immediately sees the running total and next step.
    if (!wasSelected) {
      requestAnimationFrame(() => {
        document.getElementById("confirm-donation")?.scrollIntoView({ behavior: "smooth", block: "end" })
      })
    }
  }

  const removePujaItem = (itemToRemove: DonationItem) => {
    setSelectedPujaItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.purpose === itemToRemove.purpose &&
            item.category === itemToRemove.category &&
            item.date === itemToRemove.date
          ),
      ),
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getCurrentAmount = () => {
    let total = selectedPujaItems.reduce((sum, item) => sum + item.amount, 0)
    total += selectedOfferings.reduce((sum, item) => sum + item.amount, 0)
    return `₹${total.toLocaleString("en-IN")}`
  }

  const getRawCurrentAmount = () => {
    let total = selectedPujaItems.reduce((sum, item) => sum + item.amount, 0)
    total += selectedOfferings.reduce((sum, item) => sum + item.amount, 0)
    return total
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
      errors.amount = "Please select at least one puja item or an offering." // Updated error message
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
        description: "Please fill in all required fields and select at least one puja item or an offering.", // Updated description
        variant: "error",
      })
      return
    }

    setIsSubmitting(true)
    setReceiptPdfBase64State(null)
    setGeneratedQrCodeToken(null)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    formData.set("totalAmount", finalAmount.toFixed(2))
    formData.set("paymentMethod", paymentMethod)

    // Combine selected puja items and selected offering into a single array
    const combinedDonationItems: DonationItem[] = [...selectedPujaItems]
    selectedOfferings.forEach((offering) => {
      combinedDonationItems.push({
        purpose: offering.name,
        category: "General Offering", // A generic category for offerings
        amount: offering.amount,
        date: new Date().toISOString().split("T")[0], // Use current date for offerings
      })
    })
    formData.set("donationItems", JSON.stringify(combinedDonationItems)) // Pass combined items

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
      if (result.receiptPdfBase64) {
        setReceiptPdfBase64State(result.receiptPdfBase64)
      }
      if (result.qrCodeToken) {
        setGeneratedQrCodeToken(result.qrCodeToken)
      }
      // Reset form fields
      setSelectedPujaItems([])
      setSelectedOfferings([])
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
      URL.revokeObjectURL(url)
      toast({
        title: "Receipt Downloaded",
        description: "Your donation receipt has been downloaded.",
        variant: "default",
      })
    }
  }

  const handleOfferingSelect = (offering: OfferingItem) => {
    setSelectedOfferings((prevSelected) => {
      const exists = prevSelected.some((item) => item.name === offering.name)
      if (exists) {
        return prevSelected.filter((item) => item.name !== offering.name)
      } else {
        return [...prevSelected, offering]
      }
    })
  }

  return (
    <section className="pb-16 bg-ivory">
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-4">
            Donate to <span className="text-kallol-700">{puja.name}</span>
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl mx-auto">
            {puja.description} Your contribution directly supports the successful organization of this sacred event.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Puja Items Selection */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">
              Select <span className="text-kallol-700">Donation Items</span>
            </h2>

            <Card className="border-stone-line shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {puja.items.map((item, itemIndex) => {
                    const isSelected = selectedPujaItems.some(
                      (selected) =>
                        selected.purpose === item.purpose &&
                        selected.category === item.category &&
                        selected.date === item.date,
                    )
                    return (
                      <Button
                        key={itemIndex}
                        type="button"
                        className={cn(
                          "flex flex-col h-auto py-3 transition-colors text-center whitespace-normal",
                          isSelected
                            ? "bg-kallol-700 hover:bg-kallol-800 text-white"
                            : "border-2 border-kallol-700 text-kallol-700 hover:bg-kallol-50 bg-transparent",
                        )}
                        onClick={() => handlePujaDonationSelect(item.amount, item.purpose, item.category, item.date)}
                      >
                        <span className="font-medium text-base">{item.purpose}</span>
                        <span className="text-sm">₹{item.amount.toLocaleString("en-IN")}</span>
                        {item.date && (
                          <span className="text-xs text-ink-faint mt-1">
                            ({new Date(item.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })})
                          </span>
                        )}
                      </Button>
                    )
                  })}
                </div>
                {formErrors.amount && (
                  <p className="text-red-500 text-sm mt-4 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formErrors.amount}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Display selected puja items */}
            {selectedPujaItems.length > 0 && (
              <div className="mt-6">
                <Label className="text-base font-medium text-ink mb-2 block">Your Selected Items:</Label>
                <Card className="border-stone-line">
                  <CardContent className="p-4 space-y-2">
                    {selectedPujaItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-kallol-50 p-3 rounded-md">
                        <span className="text-ink text-sm">
                          {item.purpose} ({item.category}) - ₹{item.amount.toLocaleString("en-IN")}
                          {item.date && (
                            <span className="ml-2 text-ink-mute">
                              (
                              {new Date(item.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                              )
                            </span>
                          )}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePujaItem(item)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Puja-Specific Offerings Section — hidden when a puja has none */}
            {puja.offerings.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">
                Select <span className="text-kallol-700">{puja.name}</span> Offerings
              </h2>
              <Card className="border-stone-line shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {puja.offerings.map((offering, index) => (
                      <div key={index} className="flex items-start">
                        <input
                          type="checkbox"
                          id={`offering-${index}`}
                          name={offering.name}
                          checked={selectedOfferings.some((item) => item.name === offering.name)}
                          onChange={() => handleOfferingSelect(offering)}
                          className="h-4 w-4 text-kallol-700 focus:ring-kallol-700 border-stone-line rounded mt-1"
                        />
                        <label
                          htmlFor={`offering-${index}`}
                          className="ml-3 block text-base font-medium text-ink cursor-pointer"
                        >
                          <div className="font-semibold">{offering.name}: ₹{offering.amount.toLocaleString("en-IN")}</div>
                          {offering.description && (
                            <div className="text-sm text-ink-mute mt-1">{offering.description}</div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            )}

          </motion.div>

          {/* Donation Form Section */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card className="border-stone-line shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-ink">Complete Your Donation</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form id="confirm-donation" onSubmit={handleSubmit} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-base font-medium text-ink mb-4 block">Payment Method</Label>
                    <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-kallol-50">
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
                          id="first-name"
                          type="text"
                          className="mt-1 border-stone-line focus:border-kallol-700 focus:ring-kallol-700"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value)
                            setFormErrors((prev) => ({ ...prev, firstName: "" }))
                          }}
                          name="firstName"
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
                        <Label htmlFor="last-name" className="text-sm font-medium text-ink-soft">
                          Last Name
                        </Label>
                        <Input
                          id="last-name"
                          type="text"
                          className="mt-1 border-stone-line focus:border-kallol-700 focus:ring-kallol-700"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value)
                            setFormErrors((prev) => ({ ...prev, lastName: "" }))
                          }}
                          name="lastName"
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
                      <Label htmlFor="gotra" className="text-sm font-medium text-ink-soft">
                        Gotra
                      </Label>
                      <Input
                        id="gotra"
                        type="text"
                        className="mt-1 border-stone-line focus:border-kallol-700 focus:ring-kallol-700"
                        value={gotra}
                        onChange={(e) => {
                          setGotra(e.target.value)
                          setFormErrors((prev) => ({ ...prev, gotra: "" }))
                        }}
                        name="gotra"
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
                      <Label htmlFor="phone" className="text-sm font-medium text-ink-soft">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="mt-1 border-stone-line focus:border-kallol-700 focus:ring-kallol-700"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value)
                          setFormErrors((prev) => ({ ...prev, phoneNumber: "" }))
                        }}
                        name="phoneNumber"
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
                        <Label htmlFor="email" className="text-sm font-medium text-ink-soft">
                          Email (Optional)
                        </Label>
                        <Input
                          id="email"
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
                          <p className="text-red-500 text-sm mt-1 flex items-center">
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
                        id="pan-number"
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
                        <p className="text-red-500 text-sm mt-1 flex items-center">
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
                        name="message"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-auto min-h-0 whitespace-normal text-center leading-snug bg-kallol-700 hover:bg-kallol-800 text-white py-3 px-4 text-base sm:text-lg shadow-md"
                    disabled={
                      isSubmitting ||
                      isRedirecting ||
                      (selectedPujaItems.length === 0 && selectedOfferings.length === 0)
                    }
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
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">
            Recognition <span className="text-kallol-700">Donors</span>
          </h2>
          <p className="text-lg text-ink-soft max-w-2xl mx-auto">
            Thank you to all our generous donors who have supported Kallol's cultural initiatives and temple
            maintenance.
          </p>
        </motion.div>
      </div>
    
</section>
  )
}
