"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Heart,
  Users,
  Building,
  CreditCard,
  Smartphone,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { submitDonation } from "@/actions/donations" // Import the Server Action
import { cn } from "@/lib/utils"
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://pwjobmhkgwdebrjjkdjk.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function DonatePage() {
  const [selectedAmounts, setSelectedAmounts] = useState<string[]>([])
  const [customAmount, setCustomAmount] = useState("")
  const [selectedPurpose, setSelectedPurpose] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("") // New state for category
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [copied, setCopied] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [gotra, setGotra] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receiptPdfBase64, setReceiptPdfBase64] = useState<string | null>(null) // New state for PDF
  const [generatedQrCodeToken, setGeneratedQrCodeToken] = useState<string | null>(null) // New state for QR token

  const { toast } = useToast()

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const predefinedAmounts = ["₹500", "₹1000", "₹2500", "₹5000", "₹10000"]

  const pujaDonations = [
    {
      id: "durga-puja",
      name: "Durga Puja",
      description: "Support the grand annual Durga Puja celebration, the largest festival for Bengalis.",
      items: [
        { purpose: "Idol Decoration", amount: 25000 },
        { purpose: "Bhog Prasad", amount: 15000 },
        { purpose: "Cultural Program", amount: 10000 },
        { purpose: "Pandal Setup", amount: 50000 },
      ],
    },
    {
      id: "kali-puja",
      name: "Kali Puja",
      description: "Contribute to the sacred Kali Puja, held at our Kali Mandir.",
      items: [
        { purpose: "Puja Samagri", amount: 7500 },
        { purpose: "Flower Decoration", amount: 5000 },
        { purpose: "Lighting & Sound", amount: 8000 },
      ],
    },
    {
      id: "saraswati-puja",
      name: "Saraswati Puja",
      description: "Help us celebrate Saraswati Puja, dedicated to the Goddess of knowledge and arts.",
      items: [
        { purpose: "Books & Stationery for Kids", amount: 3000 },
        { purpose: "Cultural Performances", amount: 6000 },
        { purpose: "Prasad Distribution", amount: 2000 },
      ],
    },
    {
      id: "lakshmi-puja",
      name: "Lakshmi Puja",
      description: "Support the worship of Goddess Lakshmi for prosperity and well-being.",
      items: [
        { purpose: "Alpona & Rangoli", amount: 2500 },
        { purpose: "Diya & Lighting", amount: 1500 },
      ],
    },
    {
      id: "general-fund",
      name: "General Temple Fund",
      description: "Your donation to the general fund helps with ongoing temple maintenance and operational costs.",
      items: [
        { purpose: "Daily Puja Expenses", amount: 1000 },
        { purpose: "Temple Cleaning", amount: 500 },
        { purpose: "Utility Bills", amount: 2000 },
      ],
    },
  ]

  const handlePujaDonationSelect = (amount: number, purpose: string, category: string) => {
    setCustomAmount(amount.toString()) // Set custom amount to the puja amount
    setSelectedAmounts([]) // Clear predefined amount selection
    setSelectedPurpose(purpose) // Set the purpose
    setSelectedCategory(category) // Set the category
  }

  const upiId = "kallol8655852917@iob"
  const paytmNumber = "+91 98765 43210"

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
    setSelectedPurpose("") // Clear purpose if a general amount is selected
    setSelectedCategory("") // Clear category if a general amount is selected
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmounts([]) // Clear multi-selected amounts
    setSelectedPurpose("") // Clear purpose if custom amount is entered
    setSelectedCategory("") // Clear category if custom amount is entered
  }

  const getCurrentAmount = () => {
    if (customAmount) return `₹${customAmount}`
    if (selectedPurpose) return `₹${customAmount}` // If puja purpose is selected, amount comes from customAmount
    if (selectedAmounts.length > 0) {
      const total = selectedAmounts.reduce((sum, amountStr) => {
        return sum + Number.parseFloat(amountStr.replace("₹", ""))
      }, 0)
      return `₹${total.toLocaleString("en-IN")}`
    }
    return "₹0"
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

    let finalAmount: number | null = null
    if (selectedPurpose) {
      // If a puja purpose is selected, the amount must come from customAmount (which was set by the button)
      finalAmount = Number.parseFloat(customAmount)
      if (isNaN(finalAmount) || finalAmount <= 0) {
        errors.amount = "Please select a valid Puja donation amount."
      }
    } else if (customAmount) {
      finalAmount = Number.parseFloat(customAmount)
      if (isNaN(finalAmount) || finalAmount <= 0) {
        errors.amount = "Donation amount must be greater than zero."
      }
    } else if (selectedAmounts.length > 0) {
      // New condition for multi-select
      finalAmount = selectedAmounts.reduce((sum, amountStr) => {
        return sum + Number.parseFloat(amountStr.replace("₹", ""))
      }, 0)
      if (isNaN(finalAmount) || finalAmount <= 0) {
        errors.amount = "Please select a valid donation amount."
      }
    } else {
      errors.amount = "Please select or enter a donation amount."
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
    setReceiptPdfBase64(null) // Clear previous receipt
    setGeneratedQrCodeToken(null) // Clear previous QR token

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    formData.set("amount", finalAmount!.toFixed(2)) // Use the validated finalAmount
    formData.set("paymentMethod", paymentMethod)
    if (selectedPurpose) {
      // Only include purpose if a specific Puja button was selected
      formData.set("purpose", selectedPurpose)
    }
    if (selectedCategory) {
      // Include category if a specific Puja button was selected
      formData.set("category", selectedCategory)
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
        setReceiptPdfBase64(result.receiptPdfBase64)
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
      setMessage("")
      setSelectedPurpose("") // Clear selected purpose on success
      setSelectedCategory("") // Clear selected category on success
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

            <Accordion type="single" collapsible className="w-full space-y-4">
              {pujaDonations.map((puja) => (
                <Card key={puja.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <AccordionItem value={puja.id} className="border-none">
                    <AccordionTrigger className="flex items-center justify-between p-6 text-lg font-semibold text-gray-900 hover:no-underline">
                      <div className="flex items-center space-x-4">
                        <Heart className="h-6 w-6 text-kallol-700" />
                        <span>{puja.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                      <p className="text-gray-700 mb-4">{puja.description}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {puja.items.map((item, itemIndex) => (
                          <Button
                            key={itemIndex}
                            type="button"
                            className={cn(
                              "flex flex-col h-auto py-3 transition-colors", // Common layout and transition
                              selectedPurpose === item.purpose && Number.parseFloat(customAmount) === item.amount
                                ? "bg-kallol-700 hover:bg-kallol-800 text-white" // Selected state styling
                                : "border-2 border-kallol-700 text-kallol-700 hover:bg-kallol-50 bg-transparent", // Unselected state styling
                            )}
                            onClick={() => handlePujaDonationSelect(item.amount, item.purpose, puja.name)} // Pass puja.name as category
                          >
                            <span className="font-medium text-base">{item.purpose}</span>
                            <span className="text-sm">₹{item.amount.toLocaleString("en-IN")}</span>
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              ))}
            </Accordion>
          </motion.div>

          {/* Donation Form Section */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-900">Make a Donation</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Hidden input for category */}
                  <input type="hidden" name="category" value={selectedCategory} />

                  {/* Amount Selection */}
                  <div>
                    <Label className="text-base font-medium text-gray-900 mb-4 block">Select Amount (INR)</Label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {predefinedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          className={cn(
                            "h-auto py-3 transition-colors", // Added h-auto py-3 for consistent height
                            selectedAmounts.includes(amount)
                              ? "bg-kallol-700 hover:bg-kallol-800 text-white"
                              : "border-2 border-kallol-700 text-kallol-700 hover:bg-kallol-50 bg-transparent", // Explicitly added bg-transparent
                          )}
                          onClick={() => handleAmountSelect(amount)}
                          disabled={!!selectedPurpose} // Disable if a puja purpose is selected
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
                          name="amount"
                          disabled={!!selectedPurpose} // Disable if a puja purpose is selected
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
                      <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                        <TabsTrigger
                          value="upi"
                          className="data-[state=active]:bg-kallol-700 data-[state=active]:text-white"
                        >
                          <Smartphone className="h-4 w-4 mr-2" />
                          UPI
                        </TabsTrigger>
                        <TabsTrigger
                          value="paytm"
                          className="data-[state=active]:bg-kallol-700 data-[state=active]:text-white"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Paytm
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="upi" className="mt-4">
                        <Card className="border-kallol-200 bg-kallol-50">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <QrCode className="h-16 w-16 mx-auto mb-4 text-kallol-700" />
                              <h3 className="font-semibold text-gray-900 mb-2">UPI Payment</h3>
                              <p className="text-sm text-gray-700 mb-4">Scan QR code or use UPI ID to make payment</p>
                              <div className="bg-white p-3 rounded-md border border-kallol-200 mb-4">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-sm">{upiId}</span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(upiId)}
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

                      <TabsContent value="paytm" className="mt-4">
                        <Card className="border-kallol-200 bg-kallol-50">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <CreditCard className="h-16 w-16 mx-auto mb-4 text-kallol-700" />
                              <h3 className="font-semibold text-gray-900 mb-2">Paytm Payment</h3>
                              <p className="text-sm text-gray-700 mb-4">Send money to our Paytm number</p>
                              <div className="bg-white p-3 rounded-md border border-kallol-200 mb-4">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-sm">{paytmNumber}</span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(paytmNumber)}
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
                    className="w-full bg-kallol-700 hover:bg-kallol-800 text-white py-3 text-lg shadow-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
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
          className="text-center"
        >
          <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-kallol-50 p-8">
            <CardContent className="p-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Donor Recognition</h2>
              <p className="text-gray-700 max-w-2xl mx-auto mb-6">
                We deeply appreciate all our donors and supporters. Major contributors will be recognized in our annual
                report and during special events at the Kali Mandir.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="bg-kallol-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-kallol-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Supporter</h3>
                  <p className="text-sm text-gray-600">₹500 - ₹2,499</p>
                </div>
                <div className="text-center">
                  <div className="bg-kallol-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Users className="h-8 w-8 text-kallol-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Patron</h3>
                  <p className="text-sm text-gray-600">₹2,500 - ₹9,999</p>
                </div>
                <div className="text-center">
                  <div className="bg-kallol-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Building className="h-8 w-8 text-kallol-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Benefactor</h3>
                  <p className="text-sm text-gray-600">₹10,000+</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
