"use server"

import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib"
import qrcode from "qrcode"
import { createClient } from "@supabase/supabase-js" // Import Supabase client

const KALLOL_LOGO_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kallol%20Logo-nzQyFJe53XiKXnTvKn7jbus1vKTW0l.png"

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// New interfaces for donation items and QR scan records
interface DonationItem {
  purpose: string
  category: string
  amount: string // Amount for this specific item
  date?: string // Added date property
}

interface QrScanRecord {
  timestamp: string
  itemIndex: number // Index of the item in the original `donationItems` array that this scan corresponds to
}

interface DonationRecord {
  id: string
  firstName: string
  lastName: string
  gotra: string
  phoneNumber: string
  totalAmount: string // Total amount of the donation
  paymentMethod: string
  message?: string
  status: string
  timestamp: string
  qrCodeToken?: string
  donationItems: DonationItem[] // Array of items the donation covers
  qrCodeScans: QrScanRecord[] // Array of successful scans, each linked to an item
}

/**
 * Generates a PDF receipt for a given donation record.
 * @param donation The donation record.
 * @param qrCodeDataUrl The data URL of the QR code image.
 * @returns A base64 encoded string of the PDF.
 */
async function generateDonationReceiptPdf(donation: DonationRecord, qrCodeDataUrl?: string): Promise<string> {
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
  page.drawText(`Gotra: ${donation.gotra}`, { x: margin, y: y, font, size: 12, color: rgb(0, 0, 0) })
  y -= 20
  page.drawText(`Phone: ${donation.phoneNumber}`, { x: margin, y: y, font, size: 12, color: rgb(0, 0, 0) })
  y -= 40

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
 * Handles donation submission and stores it in Supabase.
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

  let qrCodeToken: string | undefined = undefined
  let qrCodeDataUrl: string | undefined = undefined

  // Determine if QR code should be generated
  const shouldGenerateQrCode = donationItems.some(
    (item) => item.purpose.includes("Special Puja") || item.purpose.includes("Evening Puja"),
  )

  if (shouldGenerateQrCode) {
    qrCodeToken = crypto.randomUUID() // Generate unique token for QR code
    qrCodeDataUrl = await qrcode.toDataURL(qrCodeToken, { errorCorrectionLevel: "H", margin: 1, scale: 4 })
  }

  const newDonationData = {
    first_name: firstName,
    last_name: lastName,
    gotra: gotra,
    phone_number: phoneNumber,
    total_amount: totalAmount.toFixed(2),
    payment_method: paymentMethod,
    message: message || null,
    status: isPaymentSuccessful ? "success" : "failure",
    qr_code_token: qrCodeToken || null, // Store null if no QR code is generated
    donation_items: donationItems, // Supabase will store this as JSONB
    qr_code_scans: [], // Initialize as empty
  }

  const { data, error } = await supabase.from("donations").insert([newDonationData]).select().single()

  if (error) {
    console.error("Error inserting donation:", error)
    return { success: false, message: `Failed to record donation: ${error.message}` }
  }

  const newDonationRecord: DonationRecord = {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    gotra: data.gotra,
    phoneNumber: data.phone_number,
    totalAmount: data.total_amount,
    paymentMethod: data.payment_method,
    message: data.message || undefined,
    status: data.status,
    timestamp: data.timestamp,
    qrCodeToken: data.qr_code_token || undefined, // Ensure it's undefined if null from DB
    donationItems: data.donation_items,
    qrCodeScans: data.qr_code_scans,
  }

  if (isPaymentSuccessful) {
    console.log("Successful Donation:", newDonationRecord)
    const receiptPdfBase64 = await generateDonationReceiptPdf(newDonationRecord, qrCodeDataUrl)
    return { success: true, message: "Donation confirmed successfully!", receiptPdfBase64, qrCodeToken }
  } else {
    console.log("Unsuccessful Donation:", newDonationRecord)
    return { success: false, message: "Payment failed. Please try again." }
  }
}

/**
 * Retrieves all successful and unsuccessful donation records from Supabase.
 * @returns An object containing arrays of successful and unsuccessful donations.
 */
export async function getDonations() {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const { data, error } = await supabase.from("donations").select("*").order("timestamp", { ascending: false })

  if (error) {
    console.error("Error fetching donations:", error)
    return { successful: [], unsuccessful: [] }
  }

  const allDonations: DonationRecord[] = data.map((d: any) => ({
    id: d.id,
    firstName: d.first_name,
    lastName: d.last_name,
    gotra: d.gotra,
    phoneNumber: d.phone_number,
    totalAmount: d.total_amount,
    paymentMethod: d.payment_method,
    message: d.message || undefined,
    status: d.status,
    timestamp: d.timestamp,
    qrCodeToken: d.qr_code_token || undefined,
    donationItems: d.donation_items,
    qrCodeScans: d.qr_code_scans,
  }))

  const successful = allDonations.filter((d) => d.status === "success")
  const unsuccessful = allDonations.filter((d) => d.status === "failure")

  return {
    successful,
    unsuccessful,
  }
}

/**
 * Exports donation records to a CSV string from Supabase.
 * @param type The type of donations to export ('successful' or 'unsuccessful').
 * @returns A CSV formatted string.
 */
export async function exportDonationsToCsv(type: "successful" | "unsuccessful") {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const { data, error } = await supabase
    .from("donations")
    .select(
      "id, first_name, last_name, gotra, phone_number, total_amount, payment_method, message, status, timestamp, qr_code_token, donation_items, qr_code_scans",
    )
    .eq("status", type === "successful" ? "success" : "failure")
    .order("timestamp", { ascending: false })

  if (error) {
    console.error("Error fetching donations for CSV export:", error)
    return ""
  }

  const filteredData = data.map((d: any) => ({
    id: d.id,
    firstName: d.first_name,
    lastName: d.last_name,
    gotra: d.gotra,
    phoneNumber: d.phone_number,
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
