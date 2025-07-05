"use server"

import { promises as fs } from "fs"
import path from "path"

const DONATIONS_FILE_PATH = path.join(process.cwd(), "data", "donations.json")

interface DonationRecord {
  id: string
  firstName: string
  lastName: string
  amount: string
  purpose?: string
  category?: string
  qrCodeToken?: string
  qrCodeUsed?: boolean
  timestamp: string
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
 * Validates a QR code token and marks it as used if valid and unused.
 * @param token The unique QR code token scanned.
 * @returns An object indicating success/failure and relevant donation details.
 */
export async function validateQrCode(token: string): Promise<{
  success: boolean
  message: string
  donation?: Omit<DonationRecord, "qrCodeToken" | "qrCodeUsed">
}> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const allDonations = await readDonationsFromFile()
  const donationIndex = allDonations.findIndex((d) => d.qrCodeToken === token)

  if (donationIndex === -1) {
    return { success: false, message: "Invalid QR Code. No matching donation found." }
  }

  const donation = allDonations[donationIndex]

  if (donation.qrCodeUsed) {
    return { success: false, message: "QR Code already used for this donation." }
  }

  // Mark QR code as used
  allDonations[donationIndex].qrCodeUsed = true
  await writeDonationsToFile(allDonations)

  // Return relevant details without sensitive info or QR code data
  const { qrCodeToken, qrCodeUsed, ...donationDetails } = donation
  return {
    success: true,
    message: "QR Code validated successfully! Donation confirmed.",
    donation: donationDetails,
  }
}
