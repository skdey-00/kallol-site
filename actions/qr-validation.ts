"use server"

import { findOne, update, query } from "@/lib/db"
import { localDb, isSupabaseConfigured } from "@/lib/local-db"

// Check if PostgreSQL database is configured
function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL
}

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
  photoPath?: string // Path to the verification photo captured at scan time
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
export async function validateQrCode(
  token: string,
  photoBase64?: string,
): Promise<{
  success: boolean
  message: string
  donation?: Omit<DonationRecord, "qrCodeToken" | "donationItems" | "qrCodeScans"> // Basic donation info
  scannedItem?: DonationItem & { scanTimestamp: string } // Details of the specific item scanned
}> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  let donationData: any | null

  if (!isDatabaseConfigured()) {
    // --- LOCAL DB (development mode) ---
    donationData = localDb.getByToken(token)
  } else {
    // --- POSTGRESQL (production) ---
    try {
      donationData = await findOne("donations", "qr_code_token", token)
    } catch (error) {
      console.error("Error finding donation by token:", error)
      donationData = null
    }
  }

  if (!donationData) {
    return { success: false, message: "Invalid QR Code. No matching donation found." }
  }

  // Map database data to DonationRecord interface
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
  let photoId: string | undefined
  if (photoBase64) {
    if (!isDatabaseConfigured()) {
      // --- LOCAL DB (development mode) ---
      const photoPath = localDb.savePhoto(photoBase64)
      photoId = photoPath // Use path as ID for local mode
    } else {
      // --- POSTGRESQL (production) ---
      try {
        // Convert base64 to buffer
        const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "")
        const photoBuffer = Buffer.from(base64Data, "base64")
        const filename = `scan_${Date.now()}_${itemIndexToScan}.jpg`

        // Insert photo into database
        const photoResult = await query(
          `INSERT INTO scan_photos (donation_id, filename, mime_type, photo_data) VALUES ($1, $2, $3, $4) RETURNING id`,
          [donation.id, filename, "image/jpeg", photoBuffer]
        )
        photoId = photoResult.rows[0]?.id
      } catch (error) {
        console.error("Error saving photo to database:", error)
        // Continue without photo if upload fails
      }
    }
  }

  const newScanRecord: QrScanRecord = {
    timestamp: new Date().toISOString(),
    itemIndex: itemIndexToScan,
    photoPath: photoId,
  }
  const updatedQrCodeScans = [...donation.qrCodeScans, newScanRecord]

  if (!isDatabaseConfigured()) {
    // --- LOCAL DB (development mode) ---
    localDb.updateScans(donation.id, updatedQrCodeScans)
  } else {
    // --- POSTGRESQL (production) ---
    try {
      await update("donations", donation.id, { qr_code_scans: updatedQrCodeScans })
    } catch (error) {
      console.error("Error updating donation with new scan:", error)
      return { success: false, message: `Failed to record scan: ${error instanceof Error ? error.message : "Unknown error"}` }
    }
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
