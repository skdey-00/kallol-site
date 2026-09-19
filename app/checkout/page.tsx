"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  AlertCircle,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { INDIAN_STATES } from "@/lib/shop-data"
import { submitOnlineOrder, submitCounterOrder } from "@/actions/orders"

/**
 * WooCommerce-style checkout for Puja Offerings: billing details + order
 * review + payment method ("Pay at the Counter" or "Pay via Instamojo"),
 * mirroring the flow on the old kallolmumbai.com site.
 */

type PaymentMethod = "online" | "counter"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, hydrated, subtotal, clearCart } = useCart()
  const { toast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  // Billing fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [gotra, setGotra] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("Maharashtra")
  const [pincode, setPincode] = useState("")
  const [panNumber, setPanNumber] = useState("")
  const [message, setMessage] = useState("")

  // Once hydrated, an empty cart means there is nothing to check out.
  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/donate")
    }
  }, [hydrated, items.length, router])

  const isOnline = paymentMethod === "online"
  const belowOnlineMinimum = subtotal < 9

  const validate = (): boolean => {
    const errors: { [key: string]: string } = {}
    if (!firstName.trim()) errors.firstName = "First name is required"
    if (!lastName.trim()) errors.lastName = "Last name is required"
    if (!phoneNumber.trim()) errors.phoneNumber = "Phone number is required"
    if (!email.trim()) {
      errors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address"
    }
    if (!addressLine1.trim()) errors.addressLine1 = "Street address is required"
    if (!city.trim()) errors.city = "Town / City is required"
    if (!state) errors.state = "Please select a state"
    if (!/^\d{6}$/.test(pincode.trim())) errors.pincode = "PIN code must be 6 digits"
    if (subtotal > 50000 && !panNumber.trim()) {
      errors.panNumber = "PAN is required for orders above ₹50,000"
    }
    if (panNumber.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.trim().toUpperCase())) {
      errors.panNumber = "Invalid PAN format (expected: ABCDE1234F)"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const buildFormData = (): FormData => {
    const formData = new FormData()
    formData.set("firstName", firstName)
    formData.set("lastName", lastName)
    formData.set("gotra", gotra)
    formData.set("phoneNumber", phoneNumber)
    formData.set("email", email)
    formData.set("addressLine1", addressLine1)
    formData.set("addressLine2", addressLine2)
    formData.set("city", city)
    formData.set("state", state)
    formData.set("pincode", pincode)
    formData.set("panNumber", panNumber)
    formData.set("message", message)
    formData.set(
      "cartItems",
      JSON.stringify(items.map((i) => ({ productId: i.productId, amount: i.amount, quantity: i.quantity }))),
    )
    return formData
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required billing fields.",
        variant: "error",
      })
      return
    }

    setIsSubmitting(true)
    const formData = buildFormData()

    if (isOnline) {
      const result = await submitOnlineOrder(formData)
      if (result.success && result.paymentUrl) {
        // Clear the cart before handing off — the payment completes off-site.
        clearCart()
        setIsRedirecting(true)
        window.location.href = result.paymentUrl
        return
      }
      toast({ title: "Could Not Place Order", description: result.message, variant: "error" })
      setIsSubmitting(false)
      return
    }

    const result = await submitCounterOrder(formData)
    if (result.success && result.orderId) {
      clearCart()
      router.push(`/checkout/thank-you?id=${result.orderId}`)
      return
    }
    toast({ title: "Could Not Place Order", description: result.message, variant: "error" })
    setIsSubmitting(false)
  }

  // Wait for cart hydration before rendering anything meaningful.
  if (!hydrated) {
    return (
      <main className="min-h-screen pt-20 pb-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="h-64" />
        </div>
      </main>
    )
  }

  const inputError = (key: string) =>
    formErrors[key] ? (
      <p className="text-red-500 text-sm mt-1 flex items-center">
        <AlertCircle className="h-4 w-4 mr-1" />
        {formErrors[key]}
      </p>
    ) : null

  const inputClass = "mt-1 border-gray-300 focus:border-kallol-700 focus:ring-kallol-700"

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
        >
          Checkout
        </motion.h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left: billing + payment */}
          <div className="lg:col-span-3 space-y-6">
            {/* Billing details */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Billing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first-name" className="text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="first-name"
                      className={inputClass}
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value)
                        setFormErrors((p) => ({ ...p, firstName: "" }))
                      }}
                      required
                    />
                    {inputError("firstName")}
                  </div>
                  <div>
                    <Label htmlFor="last-name" className="text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="last-name"
                      className={inputClass}
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value)
                        setFormErrors((p) => ({ ...p, lastName: "" }))
                      }}
                      required
                    />
                    {inputError("lastName")}
                  </div>
                </div>

                <div>
                  <Label htmlFor="gotra" className="text-sm font-medium text-gray-700">
                    Gotra <span className="text-gray-400 text-xs">(optional)</span>
                  </Label>
                  <Input id="gotra" className={inputClass} value={gotra} onChange={(e) => setGotra(e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className={inputClass}
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value)
                      setFormErrors((p) => ({ ...p, phoneNumber: "" }))
                    }}
                    required
                  />
                  {inputError("phoneNumber")}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setFormErrors((p) => ({ ...p, email: "" }))
                    }}
                    required
                  />
                  {inputError("email")}
                </div>

                <div>
                  <Label htmlFor="address-line1" className="text-sm font-medium text-gray-700">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address-line1"
                    placeholder="House number and street name"
                    className={inputClass}
                    value={addressLine1}
                    onChange={(e) => {
                      setAddressLine1(e.target.value)
                      setFormErrors((p) => ({ ...p, addressLine1: "" }))
                    }}
                    required
                  />
                  {inputError("addressLine1")}
                </div>

                <div>
                  <Label htmlFor="address-line2" className="text-sm font-medium text-gray-700">
                    Apartment, suite, unit, etc. <span className="text-gray-400 text-xs">(optional)</span>
                  </Label>
                  <Input
                    id="address-line2"
                    className={inputClass}
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      Town / City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      className={inputClass}
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value)
                        setFormErrors((p) => ({ ...p, city: "" }))
                      }}
                      required
                    />
                    {inputError("city")}
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="state"
                      className={`mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-kallol-700 focus:ring-kallol-700 ${formErrors.state ? "border-red-500" : ""}`}
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value)
                        setFormErrors((p) => ({ ...p, state: "" }))
                      }}
                      required
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {inputError("state")}
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                      PIN Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pincode"
                      inputMode="numeric"
                      maxLength={6}
                      className={inputClass}
                      value={pincode}
                      onChange={(e) => {
                        setPincode(e.target.value.replace(/\D/g, ""))
                        setFormErrors((p) => ({ ...p, pincode: "" }))
                      }}
                      required
                    />
                    {inputError("pincode")}
                  </div>
                </div>

                {(subtotal > 50000 || panNumber) && (
                  <div>
                    <Label htmlFor="pan-number" className="text-sm font-medium text-gray-700">
                      PAN Number{" "}
                      {subtotal > 50000 ? (
                        <span className="text-red-500">*</span>
                      ) : (
                        <span className="text-gray-400 text-xs">(optional)</span>
                      )}
                    </Label>
                    <Input
                      id="pan-number"
                      placeholder="ABCDE1234F"
                      className={`${inputClass} uppercase`}
                      value={panNumber}
                      onChange={(e) => {
                        setPanNumber(e.target.value.toUpperCase())
                        setFormErrors((p) => ({ ...p, panNumber: "" }))
                      }}
                      required={subtotal > 50000}
                    />
                    {inputError("panNumber")}
                  </div>
                )}

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Order Notes <span className="text-gray-400 text-xs">(optional)</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Any notes about your order…"
                    rows={3}
                    className={inputClass}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment method */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label
                  className={`flex items-start gap-3 rounded-md border p-4 cursor-pointer transition-colors ${
                    paymentMethod === "counter" ? "border-kallol-700 bg-kallol-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="counter"
                    checked={paymentMethod === "counter"}
                    onChange={() => setPaymentMethod("counter")}
                    className="mt-1 accent-[#8b2a2a]"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Pay at the Counter</span>
                    <p className="text-sm text-gray-600">
                      Pay in person at the Kallol office/counter. Your order will be confirmed once payment is received.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 rounded-md border p-4 transition-colors ${
                    belowOnlineMinimum
                      ? "border-gray-200 opacity-60 cursor-not-allowed"
                      : paymentMethod === "online"
                        ? "border-kallol-700 bg-kallol-50 cursor-pointer"
                        : "border-gray-200 hover:border-gray-300 cursor-pointer"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => !belowOnlineMinimum && setPaymentMethod("online")}
                    disabled={belowOnlineMinimum}
                    className="mt-1 accent-[#8b2a2a]"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Pay via Instamojo</span>
                    <p className="text-sm text-gray-600">Credit Card / Debit Card / Net Banking / UPI</p>
                    {belowOnlineMinimum && (
                      <p className="text-sm text-red-500 mt-1">
                        Online payments require a minimum total of ₹9 — use “Pay at the Counter” instead.
                      </p>
                    )}
                    {isOnline && !belowOnlineMinimum && (
                      <p className="text-sm text-gray-600 mt-2 flex items-center">
                        <Lock className="h-3.5 w-3.5 mr-1.5 text-kallol-700" />
                        You&apos;ll be redirected to Instamojo&apos;s secure page to complete the payment.
                      </p>
                    )}
                  </div>
                </label>
              </CardContent>
            </Card>
          </div>

          {/* Right: order review */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200 shadow-lg lg:sticky lg:top-32">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.productId} className="p-3 flex justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-600">
                          ₹{item.amount.toLocaleString("en-IN")} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 whitespace-nowrap">
                        ₹{(item.amount * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="text-lg font-medium text-gray-900">Total</span>
                  <span className="text-xl font-bold text-kallol-700">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-kallol-700 hover:bg-kallol-800 text-white py-3 text-base shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting || isRedirecting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {isRedirecting ? "Redirecting to secure payment…" : "Placing order…"}
                    </>
                  ) : isOnline ? (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Place Order — Pay Online
                    </>
                  ) : (
                    <>
                      <Landmark className="h-5 w-5 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>

                <Button asChild variant="outline" className="w-full border-kallol-700 text-kallol-700 hover:bg-kallol-50">
                  <a href="/cart">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Back to Cart
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </main>
  )
}
