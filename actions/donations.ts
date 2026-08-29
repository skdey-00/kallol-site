"use server"

import qrcode from "qrcode"
import {
  buildQrCode,
  finalizeInstamojoPayment,
  findAllDonations,
  findDonationById,
  findDonationByPaymentRequestId,
  generateDonationReceiptPdf,
  insertDonation,
  mapDonationRecord,
  updateDonation,
  type DonationItem,
  type DonationRecord,
} from "@/lib/donation-service"
import { localDb } from "@/lib/local-db"
import { isInstamojoConfigured, createPaymentRequest, fetchPaymentRequest, verifyMac } from "@/lib/instamojo"

// Check if PostgreSQL database is configured
function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL
}

/**
 * Handles donation submission and stores it in PostgreSQL database.
 * @param formData The form data containing donation details.
 * @returns A success/error message and optionally the base64 PDF receipt.
 */
export async function submitDonation(
  formData: FormData,
): Promise<{ success: boolean; message: string; receiptPdfBase64?: string; qrCodeToken?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const gotra = formData.get("gotra") as string
  const phoneNumber = formData.get("phoneNumber") as string
  const panNumber = formData.get("panNumber") as string
  const totalAmount = Number.parseFloat(formData.get("totalAmount") as string)
  const paymentMethod = formData.get("paymentMethod") as string
  const message = formData.get("message") as string

  const donationItemsString = formData.get("donationItems") as string
  let donationItems: DonationItem[] = []
  if (donationItemsString) {
    try {
      donationItems = JSON.parse(donationItemsString)
    } catch (e) {
      console.error("Failed to parse donationItems:", e)
      return { success: false, message: "Invalid donation items data." }
    }
  }

  const isPaymentSuccessful = Math.random() > 0.2 // Simulate payment success/failure

  // Determine if QR code should be generated
  const { token: qrCodeToken, dataUrl: qrCodeDataUrl } = await buildQrCode(donationItems)

  const newDonationData = {
    first_name: firstName,
    last_name: lastName,
    gotra: gotra,
    phone_number: phoneNumber,
    pan_number: panNumber || null,
    total_amount: totalAmount.toFixed(2),
    payment_method: paymentMethod,
    message: message || null,
    status: isPaymentSuccessful ? "success" : "failure",
    qr_code_token: qrCodeToken, // Store null if no QR code is generated
    donation_items: donationItems, // Supabase will store this as JSONB
    qr_code_scans: [], // Initialize as empty
  }

  let data: any

  try {
    data = await insertDonation(newDonationData)
  } catch (error) {
    console.error("Error inserting donation:", error)
    return { success: false, message: `Failed to record donation: ${error instanceof Error ? error.message : "Unknown error"}` }
  }

  const newDonationRecord: DonationRecord = mapDonationRecord(data)

  if (isPaymentSuccessful) {
    console.log("Successful Donation:", newDonationRecord)
    const receiptPdfBase64 = await generateDonationReceiptPdf(newDonationRecord, qrCodeDataUrl || undefined)
    return { success: true, message: "Donation confirmed successfully!", receiptPdfBase64, qrCodeToken: qrCodeToken || undefined }
  } else {
    console.log("Unsuccessful Donation:", newDonationRecord)
    return { success: false, message: "Payment failed. Please try again." }
  }
}

/**
 * Creates a pending donation and an Instamojo payment request for the "Pay Online" flow.
 * The donor is redirected to the returned payment URL to complete payment.
 * @param formData The form data containing donation details.
 * @returns A payment URL to redirect the donor to, or an error message.
 */
export async function submitOnlineDonation(
  formData: FormData,
): Promise<{ success: boolean; message: string; paymentUrl?: string }> {
  if (!isInstamojoConfigured()) {
    return { success: false, message: "Online payments are not configured. Please use UPI or Paytm instead." }
  }

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const gotra = formData.get("gotra") as string
  const rawPhone = formData.get("phoneNumber") as string
  const email = (formData.get("email") as string)?.trim() || undefined
  const panNumber = formData.get("panNumber") as string
  const totalAmount = Number.parseFloat(formData.get("totalAmount") as string)
  const message = formData.get("message") as string

  // Instamojo amount limits
  if (!Number.isFinite(totalAmount) || totalAmount < 9 || totalAmount > 200000) {
    return { success: false, message: "Online payments must be between ₹9 and ₹2,00,000. Please use UPI or Paytm for other amounts." }
  }

  const phoneNumber = normalizePhoneNumber(rawPhone)
  if (!phoneNumber) {
    return { success: false, message: "Please enter a valid 10-digit Indian phone number." }
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Please enter a valid email address." }
  }

  const donationItemsString = formData.get("donationItems") as string
  let donationItems: DonationItem[] = []
  if (donationItemsString) {
    try {
      donationItems = JSON.parse(donationItemsString)
    } catch (e) {
      console.error("Failed to parse donationItems:", e)
      return { success: false, message: "Invalid donation items data." }
    }
  }

  // Create the donation as pending first, so we have a row to link the payment to.
  const newDonationData = {
    id: crypto.randomUUID(),
    first_name: firstName,
    last_name: lastName,
    gotra: gotra,
    phone_number: rawPhone,
    pan_number: panNumber || null,
    total_amount: totalAmount.toFixed(2),
    payment_method: "instamojo",
    message: message || null,
    status: "pending",
    qr_code_token: null,
    donation_items: donationItems,
    qr_code_scans: [],
  }

  let donationId: string
  try {
    const data = await insertDonation(newDonationData)
    donationId = data.id
  } catch (error) {
    console.error("Error inserting pending donation:", error)
    return { success: false, message: "Failed to record donation. Please try again." }
  }

  try {
    const siteUrl = getSiteUrl()
    const paymentRequest = await createPaymentRequest({
      amount: totalAmount,
      buyerName: `${firstName} ${lastName}`.trim(),
      phone: phoneNumber,
      email,
      purpose: "Donation to Kallol",
      redirectUrl: `${siteUrl}/api/donations/instamojo/return`,
      webhookUrl: `${siteUrl}/api/donations/instamojo/webhook`,
      transactionId: donationId,
    })

    await updateDonation(donationId, { instamojo_payment_request_id: paymentRequest.id })
    return { success: true, message: "Redirecting to payment…", paymentUrl: paymentRequest.longurl }
  } catch (error) {
    console.error("Error creating Instamojo payment request:", error)
    await updateDonation(donationId, { status: "failure" }).catch(() => {})
    return { success: false, message: "Could not start the online payment. Please try again or use UPI/Paytm." }
  }
}

/**
 * Reconciles the payment server-side via the Instamojo API (redirect params are
 * never trusted), finalizes the donation, and returns the donation id for the
 * thank-you redirect. Called by the return route handler.
 *
 * `verified` reflects whether the server-side reconciliation succeeded — the
 * outcome shown to the donor always comes from Instamojo's API, so forged URLs
 * can't influence it. The URL MAC is checked opportunistically when a salt is
 * configured; a mismatch is logged but never blocks a reconciled payment.
 */
export async function handleInstamojoReturn(params: {
  paymentRequestId: string
  paymentId: string | null
  statusParam: string | null
  macProvided: string | null
}): Promise<{ donationId: string | null; verified: boolean }> {
  const salt = process.env.INSTAMOJO_SALT || ""

  // Note: on redirects Instamojo sends `payment_status`; on webhooks it sends `status`.
  const macParams: Record<string, string> = {
    payment_request_id: params.paymentRequestId,
    payment_id: params.paymentId || "",
    payment_status: params.statusParam || "",
  }
  if (salt && params.macProvided && !verifyMac(macParams, salt, params.macProvided)) {
    console.warn("Instamojo return: MAC mismatch for payment request", params.paymentRequestId)
  }

  let verified = false
  try {
    const paymentRequest = await fetchPaymentRequest(params.paymentRequestId)
    const payment = paymentRequest.payments?.find((p) => p.payment_id === params.paymentId)
    const gatewayStatus = payment ? payment.status : paymentRequest.status === "Completed" ? "Credit" : "Failed"
    await finalizeInstamojoPayment(params.paymentRequestId, params.paymentId, gatewayStatus)
    verified = true
  } catch (error) {
    console.error("Failed to reconcile Instamojo payment:", error)
  }

  const raw = await findDonationByPaymentRequestId(params.paymentRequestId)
  return { donationId: raw?.id || null, verified }
}

/**
 * Handles the Instamojo webhook POST and finalizes the donation. Returns true
 * when the callback was accepted (donation known and reconciled with the API).
 *
 * The POSTed `status` is never trusted — anyone hitting the endpoint could
 * claim "Credit". When a salt is configured the MAC must verify; either way the
 * payment is then re-fetched from the Instamojo API and the status derived from
 * that response, so a forged webhook can only trigger extra lookups.
 */
export async function handleInstamojoWebhook(fields: Record<string, string>): Promise<boolean> {
  const salt = process.env.INSTAMOJO_SALT || ""
  const mac = fields.mac
  if (salt && (!mac || !verifyMac(fields, salt, mac))) {
    return false
  }

  const paymentRequestId = fields.payment_request_id
  const paymentId = fields.payment_id || null

  // Cheap guard first: unknown payment requests never reach the API.
  const raw = await findDonationByPaymentRequestId(paymentRequestId)
  if (!raw) {
    console.error("Instamojo webhook for unknown payment request:", paymentRequestId)
    return false
  }

  // Reconcile with the API instead of trusting the POSTed `status` field.
  try {
    const paymentRequest = await fetchPaymentRequest(paymentRequestId)
    const payment = paymentRequest.payments?.find((p) => p.payment_id === paymentId)
    const gatewayStatus = payment ? payment.status : paymentRequest.status === "Completed" ? "Credit" : "Failed"
    const result = await finalizeInstamojoPayment(paymentRequestId, paymentId, gatewayStatus)
    return result !== null
  } catch (error) {
    console.error("Failed to reconcile Instamojo webhook payment:", error)
    // Transient API failure — return false so Instamojo retries the webhook.
    return false
  }
}

/**
 * Retrieves all successful, unsuccessful, and pending donation records.
 * @returns An object containing arrays of successful, unsuccessful, and pending donations.
 */
export async function getDonations() {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let rawData: any[]

  try {
    rawData = await findAllDonations()
  } catch (error) {
    console.error("Error fetching donations:", error)
    return { successful: [], unsuccessful: [], pending: [] }
  }

  const allDonations: DonationRecord[] = rawData.map(mapDonationRecord)

  const successful = allDonations.filter((d) => d.status === "success")
  const unsuccessful = allDonations.filter((d) => d.status === "failure")
  const pending = allDonations.filter((d) => d.status === "pending")

  return {
    successful,
    unsuccessful,
    pending,
  }
}

/**
 * Exports donation records to a CSV string.
 * @param type The type of donations to export ('successful', 'unsuccessful' or 'pending').
 * @returns A CSV formatted string.
 */
export async function exportDonationsToCsv(type: "successful" | "unsuccessful" | "pending") {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const statusByType: Record<typeof type, string> = {
    successful: "success",
    unsuccessful: "failure",
    pending: "pending",
  }

  let data: any[]

  try {
    const allRecords = await findAllDonations()
    data = allRecords.filter((d) => d.status === statusByType[type])
  } catch (error) {
    console.error("Error fetching donations for CSV export:", error)
    return ""
  }

  const filteredData = data.map((d: any) => ({
    id: d.id,
    firstName: d.first_name,
    lastName: d.last_name,
    gotra: d.gotra,
    phoneNumber: d.phone_number,
    panNumber: d.pan_number || undefined,
    totalAmount: d.total_amount,
    paymentMethod: d.payment_method,
    message: d.message || "",
    status: d.status,
    timestamp: d.timestamp,
    qrCodeToken: d.qr_code_token || "",
    donationItems: d.donation_items,
    qrCodeScans: d.qr_code_scans,
  }))

  if (filteredData.length === 0) {
    return ""
  }

  // Headers for the CSV, including new fields
  const headers = [
    "id",
    "firstName",
    "lastName",
    "gotra",
    "phoneNumber",
    "panNumber",
    "totalAmount",
    "paymentMethod",
    "message",
    "status",
    "timestamp",
    "qrCodeToken",
    "donationItems",
    "qrCodeScans",
  ].join(",")

  const rows = filteredData.map((record) =>
    [
      record.id,
      record.firstName,
      record.lastName,
      record.gotra,
      record.phoneNumber,
      record.panNumber,
      record.totalAmount,
      record.paymentMethod,
      record.message,
      record.status,
      record.timestamp,
      record.qrCodeToken,
      JSON.stringify(record.donationItems),
      JSON.stringify(record.qrCodeScans),
    ]
      .map((value) => {
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      })
      .join(","),
  )

  return [headers, ...rows].join("\n")
}

/**
 * Fetches a single donation by id for the thank-you page (no receipt blob).
 */
export async function getDonationById(id: string): Promise<DonationRecord | null> {
  const raw = await findDonationById(id)
  return raw ? mapDonationRecord(raw) : null
}

/**
 * Returns the stored receipt PDF (base64) for a donation, regenerating it if
 * the payment succeeded but the receipt was never generated.
 */
export async function getDonationReceipt(id: string): Promise<{ base64: string; fileName: string } | null> {
  const raw = await findDonationById(id)
  if (!raw || raw.status !== "success") return null

  let base64: string | null = raw.receipt_pdf_base64 || null
  if (!base64) {
    const donationItems: DonationItem[] = raw.donation_items || []
    let dataUrl: string | undefined = undefined
    if (raw.qr_code_token) {
      dataUrl = await qrcode.toDataURL(raw.qr_code_token, { errorCorrectionLevel: "H", margin: 1, scale: 4 })
    } else {
      const { dataUrl: freshUrl } = await buildQrCode(donationItems)
      dataUrl = freshUrl || undefined
    }
    base64 = await generateDonationReceiptPdf(mapDonationRecord(raw), dataUrl)
    await updateDonation(id, { receipt_pdf_base64: base64 }).catch(() => {})
  }

  return { base64, fileName: `kallol-donation-receipt-${id}.pdf` }
}

/** Normalizes an Indian phone number to 10 digits (strips +91 / 0 / separators). */
function normalizePhoneNumber(raw: string): string | null {
  const digits = raw.replace(/[\s\-().]/g, "")
  const stripped = digits.replace(/^(\+91|91|0)/, "")
  return /^\d{10}$/.test(stripped) ? stripped : null
}

/** Public site URL used to build the Instamojo redirect/webhook URLs. */
function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002").replace(/\/+$/, "")
}
