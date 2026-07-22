import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { join } from "path"
import { randomUUID } from "crypto"

/**
 * Local JSON-file database — drop-in stand-in for PostgreSQL during development.
 * When DATABASE_URL is set, the action files use PostgreSQL instead.
 * When it's absent, this local file-based fallback kicks in.
 *
 * Data is stored in data/local-donations.json at the project root.
 */

export interface LocalDonationRecord {
  id: string
  first_name: string
  last_name: string
  gotra: string
  phone_number: string
  pan_number?: string | null
  total_amount: string
  payment_method: string
  message?: string | null
  status: string
  timestamp: string
  qr_code_token?: string | null
  donation_items: any[]
  qr_code_scans: any[]
}

const DATA_DIR = join(process.cwd(), "data")
const DB_FILE = join(DATA_DIR, "local-donations.json")

function readDB(): LocalDonationRecord[] {
  if (!existsSync(DB_FILE)) return []
  try {
    return JSON.parse(readFileSync(DB_FILE, "utf-8"))
  } catch {
    return []
  }
}

function writeDB(records: LocalDonationRecord[]) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(DB_FILE, JSON.stringify(records, null, 2), "utf-8")
}

export const localDb = {
  /** Insert a new record. Auto-generates id + timestamp. Returns the full record. */
  insert(data: Partial<LocalDonationRecord>): LocalDonationRecord {
    const records = readDB()
    const newRecord: LocalDonationRecord = {
      id: data.id || randomUUID(),
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      gotra: data.gotra || "",
      phone_number: data.phone_number || "",
      pan_number: data.pan_number || null,
      total_amount: data.total_amount || "0",
      payment_method: data.payment_method || "",
      message: data.message || null,
      status: data.status || "success",
      timestamp: data.timestamp || new Date().toISOString(),
      qr_code_token: data.qr_code_token || null,
      donation_items: data.donation_items || [],
      qr_code_scans: data.qr_code_scans || [],
    }
    records.push(newRecord)
    writeDB(records)
    return newRecord
  },

  /** Get all records ordered by timestamp descending. */
  getAll(): LocalDonationRecord[] {
    return readDB().sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  },

  /** Get a single record by qr_code_token. Returns null if not found. */
  getByToken(token: string): LocalDonationRecord | null {
    const records = readDB()
    return records.find((r) => r.qr_code_token === token) || null
  },

  /** Update qr_code_scans for a record by id. */
  updateScans(id: string, scans: any[]): void {
    const records = readDB()
    const record = records.find((r) => r.id === id)
    if (record) {
      record.qr_code_scans = scans
      writeDB(records)
    }
  },

  /**
   * Save a photo (base64 JPEG data URL) to disk and return the URL path.
   * Photos are stored in public/scan-photos/ so they're served directly by Next.js.
   * For production with PostgreSQL, photos are stored as BLOB data in the database.
   */
  savePhoto(photoBase64: string): string {
    const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "")
    const buffer = Buffer.from(base64Data, "base64")
    const photoDir = join(process.cwd(), "public", "scan-photos")
    if (!existsSync(photoDir)) mkdirSync(photoDir, { recursive: true })
    const filename = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`
    writeFileSync(join(photoDir, filename), buffer)
    return `/scan-photos/${filename}`
  },
}

/** Returns true if PostgreSQL database is configured. */
export function isSupabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL
}
