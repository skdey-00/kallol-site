"use server"

import { createClient } from "@supabase/supabase-js" // Import Supabase client

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// New interfaces for donation items and QR scan records (consistent with donations.ts)
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
 * Validates a QR code token and marks one of its associated items as used.
 * @param token The unique QR code token scanned.
 * @returns An object indicating success/failure and relevant donation/item details.
 */
export async function validateQrCode(token: string): Promise<{
  success: boolean
  message: string
  donation?: Omit<DonationRecord, "qrCodeToken" | "donationItems" | "qrCodeScans"> // Basic donation info
  scannedItem?: DonationItem & { scanTimestamp: string } // Details of the specific item scanned
}> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  // Fetch the donation record by QR code token
  const { data: donationData, error: fetchError } = await supabase
    .from("donations")
    .select("*")
    .eq("qr_code_token", token)
    .single()

  if (fetchError || !donationData) {
    console.error("Error fetching donation for QR validation:", fetchError)
    return { success: false, message: "Invalid QR Code. No matching donation found." }
  }

  // Map Supabase data to DonationRecord interface
  const donation: DonationRecord = {
    id: donationData.id,
    firstName: donationData.first_name,
    lastName: donationData.last_name,
    gotra: donationData.gotra,
    phoneNumber: donationData.phone_number,
    totalAmount: donationData.total_amount,
    paymentMethod: donationData.payment_method,
    message: donationData.message || undefined,
    status: donationData.status,
    timestamp: donationData.timestamp,
    qrCodeToken: donationData.qr_code_token,
    donationItems: donationData.donation_items,
    qrCodeScans: donationData.qr_code_scans,
  }

  // Check if there are still items to be scanned
  if (donation.qrCodeScans.length >= donation.donationItems.length) {
    return { success: false, message: "QR Code fully used for all associated items." }
  }

  // Get the next item to be scanned
  const nextItemIndex = donation.qrCodeScans.length
  const scannedItemDetails = donation.donationItems[nextItemIndex]

  if (!scannedItemDetails) {
    return { success: false, message: "Error: Could not find next item to scan." }
  }

  // --- New: Date Validation Logic ---
  const isSpecialOrEveningPuja =
    scannedItemDetails.purpose.includes("Special Puja") || scannedItemDetails.purpose.includes("Evening Puja")

  if (isSpecialOrEveningPuja && scannedItemDetails.date) {
    const pujaDate = new Date(scannedItemDetails.date)
    const today = new Date()

    // Normalize dates to compare only year, month, and day
    const pujaDateNormalized = new Date(pujaDate.getFullYear(), pujaDate.getMonth(), pujaDate.getDate())
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    if (pujaDateNormalized.getTime() !== todayNormalized.getTime()) {
      return {
        success: false,
        message: `This QR code can only be scanned on the puja date: ${pujaDate.toLocaleDateString()}.`,
      }
    }
  }
  // --- End New: Date Validation Logic ---

  // Record the scan with a timestamp and the item index
  const newScanRecord: QrScanRecord = {
    timestamp: new Date().toISOString(),
    itemIndex: nextItemIndex,
  }
  const updatedQrCodeScans = [...donation.qrCodeScans, newScanRecord]

  // Update the donation record in Supabase
  const { error: updateError } = await supabase
    .from("donations")
    .update({ qr_code_scans: updatedQrCodeScans })
    .eq("id", donation.id)

  if (updateError) {
    console.error("Error updating donation with new scan:", updateError)
    return { success: false, message: `Failed to record scan: ${updateError.message}` }
  }

  // Prepare the response
  const { qrCodeToken: _, donationItems: __, qrCodeScans: ___, ...basicDonationInfo } = donation

  return {
    success: true,
    message: `QR Code validated successfully for ${scannedItemDetails.purpose}!`,
    donation: basicDonationInfo,
    scannedItem: {
      ...scannedItemDetails,
      scanTimestamp: newScanRecord.timestamp,
    },
  }
}
