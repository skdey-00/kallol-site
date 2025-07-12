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
 * Prioritizes items for the current day. If no item is for today, it fails and suggests the nearest date.
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

  let itemToScan: { item: DonationItem; index: number } | undefined

  // Filter for "Special Puja" or "Evening Puja" items that are meant to be QR-scannable
  const scannablePujaItemsWithIndices = donation.donationItems
    .map((item, index) => ({ item, index }))
    .filter(
      ({ item }) => item.category !== "General Offering", // QR codes are generated for all non-offering items
    )

  // Filter out already scanned items
  const unscannedItemsWithIndices = scannablePujaItemsWithIndices.filter(
    ({ index }) => !donation.qrCodeScans.some((scan) => scan.itemIndex === index),
  )

  const today = new Date()
  const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  // 1. Find an unscanned item for today
  for (const { item, index } of unscannedItemsWithIndices) {
    if (item.date) {
      const itemDate = new Date(item.date)
      const itemDateNormalized = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate())
      if (itemDateNormalized.getTime() === todayNormalized.getTime()) {
        itemToScan = { item, index }
        break // Found an item for today, prioritize this
      }
    }
  }

  // If no unscanned item is found for today, determine the appropriate error message.
  if (!itemToScan) {
    // Check if all scannable items are already used
    if (unscannedItemsWithIndices.length === 0 && scannablePujaItemsWithIndices.length > 0) {
      const allScanTimestamps = donation.qrCodeScans
        .map((scan) => new Date(scan.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        .join(", ")
      return {
        success: false,
        message: `QR Code fully used for all associated Special/Evening Puja items. All items scanned at: ${allScanTimestamps}.`,
      }
    }

    // If there are unscanned items, but none are for today, find the nearest date.
    let nearestDate: Date | null = null
    let minDateDiff = Number.POSITIVE_INFINITY

    for (const { item } of unscannedItemsWithIndices) {
      if (item.date) {
        const itemDate = new Date(item.date)
        const itemDateNormalized = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate())
        const diff = Math.abs(itemDateNormalized.getTime() - todayNormalized.getTime())

        if (diff < minDateDiff) {
          minDateDiff = diff
          nearestDate = itemDate
        }
      }
    }

    let errorMessage = "This QR code does not have an unscanned item scheduled for today."
    if (nearestDate) {
      errorMessage += ` The nearest available item is for ${nearestDate.toLocaleDateString()}.`
    } else if (unscannedItemsWithIndices.length > 0) {
      // This case should ideally not happen if unscannedItemsWithIndices has items,
      // but it's a fallback if no dates are present on those items.
      errorMessage += " No specific dates found for remaining unscanned items."
    }

    return {
      success: false,
      message: errorMessage,
    }
  }

  // If we reach here, itemToScan is defined and is for today.
  const scannedItemDetails = itemToScan.item
  const itemIndexToScan = itemToScan.index

  // Record the scan.
  const newScanRecord: QrScanRecord = {
    timestamp: new Date().toISOString(),
    itemIndex: itemIndexToScan,
  }
  const updatedQrCodeScans = [...donation.qrCodeScans, newScanRecord]

  const { error: updateError } = await supabase
    .from("donations")
    .update({ qr_code_scans: updatedQrCodeScans })
    .eq("id", donation.id)

  if (updateError) {
    console.error("Error updating donation with new scan:", updateError)
    return { success: false, message: `Failed to record scan: ${updateError.message}` }
  }

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
