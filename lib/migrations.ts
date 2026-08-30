import { executeQuery } from "@/lib/db"

/**
 * Runtime schema migrations, applied automatically once per process on the
 * first database use. This exists because Docker's init scripts
 * (scripts/*.sql, mounted at /docker-entrypoint-initdb.d) only run when the
 * postgres volume is FIRST created — a volume initialized before a migration
 * was added stays missing that schema forever, breaking the app at runtime.
 *
 * Every statement is idempotent (IF NOT EXISTS), so this is safe to re-run on
 * every deploy and cheap to check (a single fast SELECT gates the work).
 *
 * The scripts/ files remain the source of truth for what each migration does.
 */

let applied = false

export async function ensureMigrations(): Promise<void> {
  if (applied) return

  // Any statement failing here means the database is unreachable — let the
  // caller's error handling deal with it; `applied` stays false and the next
  // call retries.
  await executeQuery(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

  // 001_create_donations_table.sql (+ scan_photos)
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS donations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      gotra TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      pan_number TEXT,
      total_amount NUMERIC(10, 2) NOT NULL,
      payment_method TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      qr_code_token TEXT UNIQUE,
      donation_items JSONB NOT NULL DEFAULT '[]'::jsonb,
      qr_code_scans JSONB NOT NULL DEFAULT '[]'::jsonb
    )
  `)
  await executeQuery(`CREATE INDEX IF NOT EXISTS idx_donations_qr_code_token ON donations (qr_code_token)`)
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS scan_photos (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
      photo_data BYTEA NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
  await executeQuery(`CREATE INDEX IF NOT EXISTS idx_scan_photos_donation_id ON scan_photos(donation_id)`)
  await executeQuery(`CREATE INDEX IF NOT EXISTS idx_scan_photos_created_at ON scan_photos(created_at DESC)`)

  // 002_add_instamojo_columns.sql
  await executeQuery(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS instamojo_payment_request_id TEXT`)
  await executeQuery(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS instamojo_payment_id TEXT`)
  await executeQuery(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS receipt_pdf_base64 TEXT`)
  await executeQuery(`CREATE INDEX IF NOT EXISTS idx_donations_payment_request_id ON donations (instamojo_payment_request_id)`)
  await executeQuery(`CREATE INDEX IF NOT EXISTS idx_donations_status ON donations (status)`)

  // 003_add_checkout_columns.sql
  await executeQuery(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS email TEXT`)
  await executeQuery(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS address_line1 TEXT`)
  await executeQuery(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS address_line2 TEXT`)
  await executeQuery(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS city TEXT`)
  await executeQuery(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS state TEXT`)
  await executeQuery(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS pincode TEXT`)
  await executeQuery(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS checkout_kind TEXT`)
  await executeQuery(`CREATE INDEX IF NOT EXISTS idx_donations_checkout_kind ON donations (checkout_kind)`)

  applied = true
  console.log("Database migrations ensured")
}
