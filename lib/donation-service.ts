import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib"
import qrcode from "qrcode"
import { insert, findAll, findOne, update } from "@/lib/db"
import { localDb } from "@/lib/local-db"

/**
 * Shared donation internals (non-"use server"): DB routing between PostgreSQL and
 * the local JSON fallback, receipt/QR generation, and the idempotent Instamojo
 * payment finalizer. Imported by the server actions in actions/donations.ts and by
 * the Instamojo return/webhook route handlers.
 */

const KALLOL_LOGO_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kallol%20Logo-nzQyFJe53XiKXnTvKn7jbus1vKTW0l.png"

// Check if PostgreSQL database is configured
function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL
}

export interface DonationItem {
  purpose: string
  category: string
  amount: string // Amount for this specific item
  quantity?: number // Shop checkout line quantity (donations omit this)
  date?: string
}

export interface QrScanRecord {
  timestamp: string
  itemIndex: number // Index of the item in the original `donationItems` array that this scan corresponds to
}

export interface DonationRecord {
  id: string
  firstName: string
  lastName: string
  gotra: string
  phoneNumber: string
  panNumber?: string
  totalAmount: string // Total amount of the donation
  paymentMethod: string
  message?: string
  status: string
  timestamp: string
  qrCodeToken?: string
  donationItems: DonationItem[] // Array of items the donation covers
  qrCodeScans: QrScanRecord[] // Array of successful scans, each linked to an item
  receiptPdfBase64?: string
  // Shop checkout (checkoutKind = 'shop') billing fields; undefined for donations.
  email?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  pincode?: string
  checkoutKind?: string | null
}

export function mapDonationRecord(d: any): DonationRecord {
  return {
    id: d.id,
    firstName: d.first_name,
    lastName: d.last_name,
    gotra: d.gotra,
    phoneNumber: d.phone_number,
    panNumber: d.pan_number || undefined,
    totalAmount: d.total_amount,
    paymentMethod: d.payment_method,
    message: d.message || undefined,
    status: d.status,
    timestamp: d.timestamp,
    qrCodeToken: d.qr_code_token || undefined,
    donationItems: d.donation_items,
    qrCodeScans: d.qr_code_scans,
    email: d.email || undefined,
    addressLine1: d.address_line1 || undefined,
    addressLine2: d.address_line2 || undefined,
    city: d.city || undefined,
    state: d.state || undefined,
    pincode: d.pincode || undefined,
    checkoutKind: d.checkout_kind || null,
  }
}

/** Inserts a donation row via PostgreSQL or the local JSON fallback. */
export async function insertDonation(row: Record<string, any>): Promise<any> {
  if (!isDatabaseConfigured()) {
    return localDb.insert(row)
  }
  return insert("donations", row)
}

/** Updates a donation row by id via PostgreSQL or the local JSON fallback. */
export async function updateDonation(id: string, data: Record<string, any>): Promise<void> {
  if (!isDatabaseConfigured()) {
    localDb.update(id, data)
    return
  }
  await update("donations", id, data)
}

/** Fetches a single donation row by id via PostgreSQL or the local JSON fallback. */
export async function findDonationById(id: string): Promise<any | null> {
  if (!isDatabaseConfigured()) {
    return localDb.getAll().find((r) => r.id === id) || null
  }
  return findOne("donations", "id", id)
}

/** Fetches a single donation row by Instamojo payment request ID. */
export async function findDonationByPaymentRequestId(paymentRequestId: string): Promise<any | null> {
  if (!isDatabaseConfigured()) {
    return localDb.getByPaymentRequestId(paymentRequestId)
  }
  return findOne("donations", "instamojo_payment_request_id", paymentRequestId)
}

/** Fetches all donation rows, newest first, via PostgreSQL or the local JSON fallback. */
export async function findAllDonations(): Promise<any[]> {
  if (!isDatabaseConfigured()) {
    return localDb.getAll()
  }
  return findAll("donations", "timestamp", "DESC")
}

/**
 * Generates a QR code token + data URL for donations that include puja items
 * (i.e. any item not categorized as "General Offering").
 */
export async function buildQrCode(
  donationItems: DonationItem[],
): Promise<{ token: string | null; dataUrl: string | null }> {
  const shouldGenerateQrCode = donationItems.some((item) => item.category !== "General Offering")
  if (!shouldGenerateQrCode) {
    return { token: null, dataUrl: null }
  }
  const token = crypto.randomUUID()
  const dataUrl = await qrcode.toDataURL(token, { errorCorrectionLevel: "H", margin: 1, scale: 4 })
  return { token, dataUrl }
}

/**
 * Generates a PDF receipt for a given donation record.
 * @param donation The donation record.
 * @param qrCodeDataUrl The data URL of the QR code image.
 * @returns A base64 encoded string of the PDF.
 */
export async function generateDonationReceiptPdf(donation: DonationRecord, qrCodeDataUrl?: string): Promise<string> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage(PageSizes.A4_LANDSCAPE)

  let logoImageBytes: ArrayBuffer | undefined
  try {
    const logoResponse = await fetch(KALLOL_LOGO_URL)
    logoImageBytes = await logoResponse.arrayBuffer()
  } catch (error) {
    console.error("Failed to fetch Kallol logo:", error)
  }

  let kallolLogo = null
  if (logoImageBytes) {
    try {
      kallolLogo = await pdfDoc.embedPng(logoImageBytes)
    } catch (error) {
      console.error("Failed to embed Kallol logo:", error)
    }
  }

  let qrCodeImage = null
  if (qrCodeDataUrl) {
    // Only embed QR code if data URL is provided
    try {
      const qrCodeBytes = Buffer.from(qrCodeDataUrl.split(",")[1], "base64")
      qrCodeImage = await pdfDoc.embedPng(qrCodeBytes)
    } catch (error) {
      console.error("Failed to embed QR code:", error)
    }
  }

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const { width, height } = page.getSize()
  const margin = 50
  let y = height - margin

  // Kallol Logo (top-left)
  if (kallolLogo) {
    const logoWidth = 120
    const logoHeight = (kallolLogo.height / kallolLogo.width) * logoWidth
    page.drawImage(kallolLogo, {
      x: margin,
      y: y - logoHeight + 20, // Adjust position to be top-left
      width: logoWidth,
      height: logoHeight,
    })
    y -= logoHeight + 20 // Move y down past the logo
  }

  // Title
  page.drawText("Donation Receipt", {
    x: width / 2 - boldFont.widthOfTextAtSize("Donation Receipt", 30) / 2,
    y: y,
    font: boldFont,
    size: 30,
    color: rgb(139 / 255, 42 / 255, 42 / 255), // Kallol Red
  })
  y -= 40

  // Receipt Details
  page.drawText(`Receipt ID: ${donation.id}`, { x: margin, y: y, font, size: 12, color: rgb(0, 0, 0) })
  y -= 20
  page.drawText(`Date: ${new Date(donation.timestamp).toLocaleDateString()}`, {
    x: margin,
    y: y,
    font,
    size: 12,
    color: rgb(0, 0, 0),
  })
  y -= 20
  page.drawText(`Time: ${new Date(donation.timestamp).toLocaleTimeString()}`, {
    x: margin,
    y: y,
    font,
    size: 12,
    color: rgb(0, 0, 0),
  })
  y -= 40

  // Donor Information
  page.drawText("Donor Information:", { x: margin, y: y, font: boldFont, size: 16, color: rgb(0, 0, 0) })
  y -= 25
  page.drawText(`Name: ${donation.firstName} ${donation.lastName}`, {
    x: margin,
    y: y,
    font,
    size: 12,
    color: rgb(0, 0, 0),
  })
  y -= 20
  // Shop orders make gotra optional — skip the line when empty.
  if (donation.gotra) {
    page.drawText(`Gotra: ${donation.gotra}`, { x: margin, y: y, font, size: 12, color: rgb(0, 0, 0) })
    y -= 20
  }
  page.drawText(`Phone: ${donation.phoneNumber}`, { x: margin, y: y, font, size: 12, color: rgb(0, 0, 0) })
  y -= 20
  if (donation.panNumber) {
    page.drawText(`PAN: ${donation.panNumber}`, { x: margin, y: y, font, size: 12, color: rgb(0, 0, 0) })
    y -= 20
  }

  // Donation Details
  page.drawText("Donation Details:", { x: margin, y: y, font: boldFont, size: 16, color: rgb(0, 0, 0) })
  y -= 25
  page.drawText(`Total Amount: Rs.${donation.totalAmount}`, {
    x: margin,
    y: y,
    font: boldFont,
    size: 18,
    color: rgb(139 / 255, 42 / 255, 42 / 255),
  })
  y -= 25
  page.drawText(`Payment Method: ${donation.paymentMethod.toUpperCase()}`, {
    x: margin,
    y: y,
    font,
    size: 12,
    color: rgb(0, 0, 0),
  })
  y -= 20

  // List donation items
  if (donation.donationItems && donation.donationItems.length > 0) {
    page.drawText("Items Donated For:", { x: margin, y: y, font: boldFont, size: 12, color: rgb(0, 0, 0) })
    y -= 15
    donation.donationItems.forEach((item) => {
      const itemText =
        `- ${item.purpose} (${item.category}): Rs.${item.amount}` +
        (item.quantity ? ` x ${item.quantity}` : "") +
        (item.date ? ` (Date: ${new Date(item.date).toLocaleDateString()})` : "")
      page.drawText(itemText, {
        x: margin + 10,
        y: y,
        font,
        size: 10,
        color: rgb(0, 0, 0),
      })
      y -= 15
    })
  }
  y -= 20

  if (donation.message) {
    page.drawText(`Message: ${donation.message}`, { x: margin, y: y, font, size: 12, color: rgb(0, 0, 0) })
    y -= 20
  }
  y -= 40

  // Thank You Message (positioned to the left, above QR code)
  const thankYouText1 = "Thank you for your generous contribution to Kallol!"
  const thankYouText2 = "Your support helps us preserve Bengali culture and maintain the Kali Mandir."
  const thankYouX = margin
  const thankYouY = margin + 100 // Position above QR code, adjusted for landscape

  page.drawText(thankYouText1, {
    x: thankYouX,
    y: thankYouY,
    font: boldFont,
    size: 14,
    color: rgb(0, 0, 0),
  })

  page.drawText(thankYouText2, {
    x: thankYouX,
    y: thankYouY - 20,
    font,
    size: 10,
    color: rgb(0, 0, 0),
  })

  // QR Code (bottom-right) - Only draw if qrCodeImage is available
  if (qrCodeImage) {
    const qrSize = 100
    const qrX = width - margin - qrSize
    const qrY = margin
    page.drawImage(qrCodeImage, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
    })
    page.drawText("Scan for verification", {
      x: qrX + qrSize / 2 - font.widthOfTextAtSize("Scan for verification", 8) / 2, // Center text below QR
      y: qrY - 15,
      font,
      size: 8,
      color: rgb(0.5, 0.5, 0.5),
    })
  }

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes).toString("base64")
}

/**
 * Finalizes a donation after Instamojo reports a payment outcome (redirect or webhook).
 * Idempotent: once a donation is marked "success" it is never downgraded or re-processed;
 * a later "Credit" can still upgrade a "failure"/"pending" row.
 * @returns The updated donation record, or null if the payment request is unknown.
 */
export async function finalizeInstamojoPayment(
  paymentRequestId: string,
  paymentId: string | null,
  gatewayStatus: string,
): Promise<DonationRecord | null> {
  const raw = await findDonationByPaymentRequestId(paymentRequestId)
  if (!raw) {
    console.error("Instamojo callback for unknown payment request:", paymentRequestId)
    return null
  }

  // Success is terminal — never regenerate receipts or downgrade.
  if (raw.status === "success") {
    return mapDonationRecord(raw)
  }

  if (gatewayStatus !== "Credit") {
    await updateDonation(raw.id, { status: "failure", instamojo_payment_id: paymentId || null })
    return mapDonationRecord({ ...raw, status: "failure" })
  }

  // Credited: generate QR token + receipt, then persist everything in one update.
  const donationItems: DonationItem[] = raw.donation_items || []
  const { token, dataUrl } = await buildQrCode(donationItems)

  const donation: DonationRecord = mapDonationRecord({
    ...raw,
    status: "success",
    qr_code_token: token,
  })

  let receiptPdfBase64: string | null = null
  try {
    receiptPdfBase64 = await generateDonationReceiptPdf(donation, dataUrl || undefined)
  } catch (error) {
    // Receipt generation must not block payment confirmation.
    console.error("Failed to generate receipt for donation:", raw.id, error)
  }

  await updateDonation(raw.id, {
    status: "success",
    instamojo_payment_id: paymentId || null,
    qr_code_token: token,
    receipt_pdf_base64: receiptPdfBase64,
  })

  return { ...donation, receiptPdfBase64: receiptPdfBase64 || undefined }
}
