"use server"

import {
  insertDonation,
  updateDonation,
  type DonationItem,
} from "@/lib/donation-service"
import { isInstamojoConfigured, createPaymentRequest } from "@/lib/instamojo"
import { findShopProduct, INDIAN_STATES, type ShopProduct } from "@/lib/shop-data"
import { normalizePhoneNumber, getSiteUrl, EMAIL_REGEX } from "@/lib/checkout-validation"

/**
 * Server actions for the Puja Offerings shop checkout. Orders reuse the
 * donations table/pipeline flagged with checkout_kind = "shop" — one Instamojo
 * return/webhook route, one reconcile/finalize path, one admin view.
 *
 * Cart contents arrive from the client, so EVERY value is revalidated here:
 * amounts are name-your-price (buyer-chosen) but bounded per product, and the
 * total is always recomputed server-side — a client-sent total is ignored.
 */

// Bounds for name-your-price amounts (per item) — upper bound matches Instamojo.
const MAX_ITEM_AMOUNT = 200000
const MIN_QTY = 1
const MAX_QTY = 99
// Instamojo transaction limits for the online path.
const MIN_ONLINE_TOTAL = 9
const MAX_ONLINE_TOTAL = 200000

interface ParsedCartItem {
  productId: string
  amount: number
  quantity: number
}

interface ValidatedLine {
  product: ShopProduct
  amount: number
  quantity: number
}

interface ValidatedOrder {
  lines: ValidatedLine[]
  items: DonationItem[]
  total: number
}

class OrderValidationError extends Error {}

/**
 * Parses and validates the client cart against the catalog. Amounts are
 * buyer-chosen (name your price), so they're validated per product instead of
 * replaced; the total is recomputed from the validated lines.
 */
function validateCart(cartItemsJson: string): ValidatedOrder {
  let parsed: ParsedCartItem[]
  try {
    parsed = JSON.parse(cartItemsJson)
  } catch {
    throw new OrderValidationError("Your cart could not be read. Please go back to the shop and try again.")
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new OrderValidationError("Your cart is empty. Please add items before placing an order.")
  }

  const lines: ValidatedLine[] = []
  for (const entry of parsed) {
    const product = findShopProduct(String(entry?.productId ?? ""))
    if (!product) {
      throw new OrderValidationError("Your cart contains an item that is no longer available. Please review your cart.")
    }
    const amount = Number(entry?.amount)
    if (!Number.isFinite(amount) || amount < product.minAmount || amount > MAX_ITEM_AMOUNT) {
      throw new OrderValidationError(
        `Amount for "${product.name}" must be between ₹${product.minAmount} and ₹${MAX_ITEM_AMOUNT.toLocaleString("en-IN")}.`,
      )
    }
    const quantity = Number(entry?.quantity)
    if (!Number.isInteger(quantity) || quantity < MIN_QTY || quantity > MAX_QTY) {
      throw new OrderValidationError(`Quantity for "${product.name}" must be between ${MIN_QTY} and ${MAX_QTY}.`)
    }
    lines.push({ product, amount: Math.round(amount), quantity })
  }

  // Duplicate product ids (shouldn't happen — cart is one line per product — but stay safe).
  const seen = new Set<string>()
  for (const line of lines) {
    if (seen.has(line.product.id)) {
      throw new OrderValidationError("Your cart contains duplicate items. Please review your cart.")
    }
    seen.add(line.product.id)
  }

  const items: DonationItem[] = lines.map((line) => ({
    purpose: line.product.name,
    category: line.product.category,
    amount: line.amount.toFixed(2),
    quantity: line.quantity,
  }))

  const total = lines.reduce((sum, line) => sum + line.amount * line.quantity, 0)
  return { lines, items, total }
}

function validateBilling(formData: FormData, total: number): Record<string, string> {
  const str = (key: string) => (formData.get(key) as string | null)?.trim() || ""

  const firstName = str("firstName")
  const lastName = str("lastName")
  const gotra = str("gotra")
  const rawPhone = str("phoneNumber")
  const email = str("email")
  const addressLine1 = str("addressLine1")
  const addressLine2 = str("addressLine2")
  const city = str("city")
  const state = str("state")
  const pincode = str("pincode")
  const panNumber = str("panNumber")
  const message = str("message")

  if (!firstName) throw new OrderValidationError("First name is required.")
  if (!lastName) throw new OrderValidationError("Last name is required.")
  const phone = normalizePhoneNumber(rawPhone)
  if (!phone) throw new OrderValidationError("Please enter a valid 10-digit Indian phone number.")
  if (!email || !EMAIL_REGEX.test(email)) throw new OrderValidationError("Please enter a valid email address.")
  if (!addressLine1) throw new OrderValidationError("Street address is required.")
  if (!city) throw new OrderValidationError("Town / City is required.")
  if (!INDIAN_STATES.includes(state)) throw new OrderValidationError("Please select a valid state.")
  if (!/^\d{6}$/.test(pincode)) throw new OrderValidationError("PIN code must be 6 digits.")

  if (total > 50000) {
    if (!panNumber) throw new OrderValidationError("PAN is required for orders above ₹50,000.")
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      throw new OrderValidationError("Invalid PAN format (expected: ABCDE1234F).")
    }
  } else if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
    throw new OrderValidationError("Invalid PAN format (expected: ABCDE1234F).")
  }

  return {
    firstName,
    lastName,
    gotra,
    rawPhone,
    phone,
    email,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    panNumber,
    message,
  }
}

function buildOrderRow(billing: Record<string, string>, order: ValidatedOrder, paymentMethod: string) {
  return {
    id: crypto.randomUUID(),
    first_name: billing.firstName,
    last_name: billing.lastName,
    // gotra is NOT NULL in the schema — store an empty string when omitted.
    gotra: billing.gotra,
    phone_number: billing.rawPhone,
    pan_number: billing.panNumber ? billing.panNumber.toUpperCase() : null,
    total_amount: order.total.toFixed(2),
    payment_method: paymentMethod,
    message: billing.message || null,
    status: "pending",
    qr_code_token: null,
    donation_items: order.items,
    qr_code_scans: [],
    email: billing.email,
    address_line1: billing.addressLine1,
    address_line2: billing.addressLine2 || null,
    city: billing.city,
    state: billing.state,
    pincode: billing.pincode,
    checkout_kind: "shop",
  }
}

/**
 * Creates a pending shop order and an Instamojo payment request, and returns
 * the payment URL to redirect the buyer to. Mirrors submitOnlineDonation.
 */
export async function submitOnlineOrder(
  formData: FormData,
): Promise<{ success: boolean; message: string; paymentUrl?: string }> {
  if (!isInstamojoConfigured()) {
    return { success: false, message: "Online payments are not configured. Please choose \"Pay at the Counter\"." }
  }

  let order: ValidatedOrder
  try {
    order = validateCart((formData.get("cartItems") as string) || "")
  } catch (error) {
    return { success: false, message: error instanceof OrderValidationError ? error.message : "Invalid cart data." }
  }

  if (order.total < MIN_ONLINE_TOTAL || order.total > MAX_ONLINE_TOTAL) {
    return {
      success: false,
      message: `Online payments must be between ₹${MIN_ONLINE_TOTAL} and ₹${MAX_ONLINE_TOTAL.toLocaleString("en-IN")}. Please use "Pay at the Counter" for other amounts.`,
    }
  }

  let billing: Record<string, string>
  try {
    billing = validateBilling(formData, order.total)
  } catch (error) {
    return { success: false, message: error instanceof OrderValidationError ? error.message : "Invalid billing details." }
  }

  const row = buildOrderRow(billing, order, "instamojo")

  let orderId: string
  try {
    const data = await insertDonation(row)
    orderId = data.id
  } catch (error) {
    console.error("Error inserting pending order:", error)
    return { success: false, message: "Failed to record your order. Please try again." }
  }

  try {
    const siteUrl = getSiteUrl()
    const paymentRequest = await createPaymentRequest({
      amount: order.total,
      buyerName: `${billing.firstName} ${billing.lastName}`.trim(),
      phone: billing.phone,
      email: billing.email,
      purpose: "Puja Offerings",
      redirectUrl: `${siteUrl}/api/donations/instamojo/return`,
      webhookUrl: `${siteUrl}/api/donations/instamojo/webhook`,
      transactionId: orderId,
    })

    await updateDonation(orderId, { instamojo_payment_request_id: paymentRequest.id })
    return { success: true, message: "Redirecting to payment…", paymentUrl: paymentRequest.longurl }
  } catch (error) {
    console.error("Error creating Instamojo payment request for order:", error)
    await updateDonation(orderId, { status: "failure" }).catch(() => {})
    return { success: false, message: "Could not start the online payment. Please try again or pay at the counter." }
  }
}

/**
 * Creates a pending shop order to be paid in person at the Kallol counter.
 * No gateway involvement — the order stays "pending" until the office marks
 * payment received.
 */
export async function submitCounterOrder(
  formData: FormData,
): Promise<{ success: boolean; message: string; orderId?: string }> {
  let order: ValidatedOrder
  try {
    order = validateCart((formData.get("cartItems") as string) || "")
  } catch (error) {
    return { success: false, message: error instanceof OrderValidationError ? error.message : "Invalid cart data." }
  }

  let billing: Record<string, string>
  try {
    billing = validateBilling(formData, order.total)
  } catch (error) {
    return { success: false, message: error instanceof OrderValidationError ? error.message : "Invalid billing details." }
  }

  try {
    const data = await insertDonation(buildOrderRow(billing, order, "counter"))
    return { success: true, message: "Order placed.", orderId: data.id }
  } catch (error) {
    console.error("Error inserting counter order:", error)
    return { success: false, message: "Failed to record your order. Please try again." }
  }
}
