-- Shop checkout ("Puja Offerings") support — WooCommerce-style orders reuse the
-- donations table, flagged with checkout_kind = 'shop' (NULL = donation).
--
-- NOTE: Docker init scripts only run on the FIRST volume initialization.
-- Apply this migration to an existing database manually:
--   docker exec -i kallol-postgres psql -U kallol -d kallol_db < scripts/003_add_checkout_columns.sql

-- Buyer contact + shipping/billing address captured on the checkout form
-- (donations leave these NULL; gotra stays NOT NULL and is stored as '' when absent).
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS address_line1 TEXT,
  ADD COLUMN IF NOT EXISTS address_line2 TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS pincode TEXT;

-- 'shop' for Puja Offerings checkout orders; NULL for regular donations.
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS checkout_kind TEXT;

-- Index for filtering orders vs donations (admin views, CSV export).
CREATE INDEX IF NOT EXISTS idx_donations_checkout_kind ON donations (checkout_kind);
