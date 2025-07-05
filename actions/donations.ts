"use server"

import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"
import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib"
import qrcode from "qrcode" // Import qrcode library

const DONATIONS_FILE_PATH = path.join(process.cwd(), "data", "donations.json")

const KALLOL_LOGO_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kallol%20Logo-nzQyFJe53XiKXnTvKn7jbus1vKTW0l.png"

interface DonationRecord {
  id: string
  firstName: string
  lastName: string
  gotra: string
  phoneNumber: string
  amount: string
  paymentMethod: string
  message?: string
  purpose?: string
  category?: string
  status: string
  timestamp: string
  qrCodeToken?: string // New: Unique token for QR code
  qrCodeUsed?: boolean // New: Flag to track if QR code has been used
}

/**
 * Reads donation records from the local JSON file.
 * @returns An array of DonationRecord.
 */
async function readDonationsFromFile(): Promise<DonationRecord[]> {
  try {
    const data = await fs.readFile(DONATIONS_FILE_PATH, "utf8")
    return JSON.parse(data)
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return []
    }
    console.error("Error reading donations file:", error)
    return []
  }
}

/**
 * Writes donation records to the local JSON file.
 * @param donations The array of DonationRecord to write.
 */
async function writeDonationsToFile(donations: DonationRecord[]): Promise<void> {
  try {
    await fs.writeFile(DONATIONS_FILE_PATH, JSON.stringify(donations, null, 2), "utf8")
  } catch (error) {
    console.error("Error writing donations file:", error)
  }
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
  page.drawText(`Amount: Rs.${donation.amount}`, {
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
  if (donation.category) {
    page.drawText(`Category: ${donation.category}`, { x: margin, y: y, font, size: 12, color: rgb(0, 0, 0) })
    y -= 20
  }
  if (donation.purpose) {
    page.drawText(`Purpose: ${donation.purpose}`, { x: margin, y: y, font, size: 12, color: rgb(0, 0, 0) })
    y -= 20
  }
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

  // QR Code (bottom-right)
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
 * Handles donation submission and stores it locally.
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
  const amount = Number.parseFloat(formData.get("amount") as string)
  const paymentMethod = formData.get("paymentMethod") as string
  const message = formData.get("message") as string
  const purpose = formData.get("purpose") as string
  const category = formData.get("category") as string

  const isPaymentSuccessful = Math.random() > 0.2
  const donationStatus = isPaymentSuccessful ? "success" : "failure"

  const qrCodeToken = crypto.randomUUID() // Generate unique token for QR code

  const newDonation: DonationRecord = {
    id: crypto.randomUUID(),
    firstName,
    lastName,
    gotra,
    phoneNumber,
    amount: amount.toFixed(2),
    paymentMethod,
    message: message || undefined,
    purpose: purpose || undefined,
    category: category || undefined,
    status: donationStatus,
    timestamp: new Date().toISOString(),
    qrCodeToken: qrCodeToken, // Store the QR code token
    qrCodeUsed: false, // Initialize as unused
  }

  const existingDonations = await readDonationsFromFile()
  const updatedDonations = [newDonation, ...existingDonations]
  await writeDonationsToFile(updatedDonations)

  if (isPaymentSuccessful) {
    console.log("Successful Donation:", newDonation)
    const qrCodeDataUrl = await qrcode.toDataURL(qrCodeToken, { errorCorrectionLevel: "H", margin: 1, scale: 4 }) // Generate QR code data URL
    const receiptPdfBase64 = await generateDonationReceiptPdf(newDonation, qrCodeDataUrl)
    return { success: true, message: "Donation confirmed successfully!", receiptPdfBase64, qrCodeToken }
  } else {
    console.log("Unsuccessful Donation:", newDonation)
    return { success: false, message: "Payment failed. Please try again." }
  }
}

/**
 * Retrieves all successful and unsuccessful donation records from local file.
 * @returns An object containing arrays of successful and unsuccessful donations.
 */
export async function getDonations() {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const allDonations = await readDonationsFromFile()

  const successful = allDonations.filter((d) => d.status === "success")
  const unsuccessful = allDonations.filter((d) => d.status === "failure")

  return {
    successful,
    unsuccessful,
  }
}

/**
 * Exports donation records to a CSV string from local file.
 * @param type The type of donations to export ('successful' or 'unsuccessful').
 * @returns A CSV formatted string.
 */
export async function exportDonationsToCsv(type: "successful" | "unsuccessful") {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const allDonations = await readDonationsFromFile()
  const filteredData = allDonations.filter((d) => d.status === (type === "successful" ? "success" : "failure"))

  if (filteredData.length === 0) {
    return ""
  }

  const headers = [
    "id",
    "firstName",
    "lastName",
    "gotra",
    "phoneNumber",
    "amount",
    "paymentMethod",
    "message",
    "purpose",
    "category",
    "status",
    "timestamp",
    "qrCodeToken", // Include QR code token in CSV
    "qrCodeUsed", // Include QR code used status in CSV
  ].join(",")

  const rows = filteredData.map((record) =>
    [
      record.id,
      record.firstName,
      record.lastName,
      record.gotra,
      record.phoneNumber,
      record.amount,
      record.paymentMethod,
      record.message || "",
      record.purpose || "",
      record.category || "",
      record.status,
      record.timestamp,
      record.qrCodeToken || "", // Ensure it's included
      record.qrCodeUsed ? "true" : "false", // Ensure it's included
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
