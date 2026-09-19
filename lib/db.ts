import { Pool, QueryResult } from "pg"
import { ensureMigrations } from "@/lib/migrations"

let pool: Pool | null = null

/**
 * Query result with caller-defined row type. pg's own QueryResult<T>
 * only accepts types with an index signature, which interfaces like
 * DonationRecord don't have — this shape restores that freedom.
 */
export type RowResult<T> = Omit<QueryResult, "rows"> & { rows: T[] }

/**
 * Get or create PostgreSQL connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    pool = new Pool({
      connectionString: databaseUrl,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    })

    // Handle pool errors
    pool.on("error", (err: Error) => {
      console.error("Unexpected error on idle client", err)
      process.exit(-1)
    })
  }
  return pool
}

/**
 * Execute a SQL query
 */
export async function query<T = any>(text: string, params?: any[]): Promise<RowResult<T>> {
  // Idempotent runtime migrations run once per process before the first query.
  await ensureMigrations()
  return executeQuery<T>(text, params)
}

/**
 * Executes a query without triggering migrations (used by migrations themselves).
 */
export async function executeQuery<T = any>(text: string, params?: any[]): Promise<RowResult<T>> {
  const start = Date.now()
  try {
    const pool = getPool()
    const res = (await pool.query(text, params)) as RowResult<T>
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Query error", { text, params, error })
    throw error
  }
}

/**
 * Get a single row by ID
 */
export async function findById<T = any>(tableName: string, id: string): Promise<T | null> {
  const text = `SELECT * FROM ${tableName} WHERE id = $1`
  const result = await query<T>(text, [id])
  return result.rows[0] || null
}

/**
 * Get a single row by a specific field
 */
export async function findOne<T = any>(tableName: string, field: string, value: any): Promise<T | null> {
  const text = `SELECT * FROM ${tableName} WHERE ${field} = $1 LIMIT 1`
  const result = await query<T>(text, [value])
  return result.rows[0] || null
}

/**
 * Get all rows from a table
 */
export async function findAll<T = any>(tableName: string, orderBy?: string, orderDirection: "ASC" | "DESC" = "DESC"): Promise<T[]> {
  const text = orderBy
    ? `SELECT * FROM ${tableName} ORDER BY ${orderBy} ${orderDirection}`
    : `SELECT * FROM ${tableName}`
  const result = await query<T>(text)
  return result.rows
}

/**
 * Insert a new row
 */
export async function insert<T = any>(tableName: string, data: Record<string, any>): Promise<T> {
  const keys = Object.keys(data)
  const values = Object.values(data).map((value) => {
    // Convert arrays and objects to JSON strings for JSONB columns
    if (Array.isArray(value) || (typeof value === 'object' && value !== null && !(value instanceof Buffer))) {
      return JSON.stringify(value)
    }
    return value
  })
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ")
  const text = `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`
  const result = await query<T>(text, values)
  return result.rows[0]
}

/**
 * Update a row by ID
 */
export async function update<T = any>(tableName: string, id: string, data: Record<string, any>): Promise<T | null> {
  const keys = Object.keys(data)
  const values = Object.values(data).map((value) => {
    // Convert arrays and objects to JSON strings for JSONB columns
    if (Array.isArray(value) || (typeof value === 'object' && value !== null && !(value instanceof Buffer))) {
      return JSON.stringify(value)
    }
    return value
  })
  const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(", ")
  const text = `UPDATE ${tableName} SET ${setClause} WHERE id = $1 RETURNING *`
  const result = await query<T>(text, [id, ...values])
  return result.rows[0] || null
}

/**
 * Delete a row by ID
 */
export async function deleteById(tableName: string, id: string): Promise<boolean> {
  const text = `DELETE FROM ${tableName} WHERE id = $1`
  const result = await query(text, [id])
  return (result.rowCount || 0) > 0
}

/**
 * Get photo by ID
 */
export async function getPhotoById(photoId: string): Promise<ScanPhoto | null> {
  const text = `SELECT * FROM scan_photos WHERE id = $1`
  const result = await query<ScanPhoto>(text, [photoId])
  return result.rows[0] || null
}

/**
 * Get photos by donation ID
 */
export async function getPhotosByDonationId(donationId: string): Promise<ScanPhoto[]> {
  const text = `SELECT * FROM scan_photos WHERE donation_id = $1 ORDER BY created_at DESC`
  const result = await query<ScanPhoto>(text, [donationId])
  return result.rows
}

/**
 * Close the connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

// Export types for donation records
export interface DonationRecord {
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
  timestamp: Date
  qr_code_token?: string | null
  donation_items: any[]
  qr_code_scans: any[]
}

export interface ScanPhoto {
  id: string
  donation_id: string
  filename: string
  mime_type: string
  photo_data: Buffer
  created_at: Date
}

export interface QRScan {
  timestamp: string
  itemIndex: number
  photo_id?: string
}

export interface DonationItem {
  purpose: string
  category: string
  amount: number
}
