-- Instamojo payment gateway support.
--
-- NOTE: Docker init scripts only run on the FIRST volume initialization.
-- Apply this migration to an existing database manually:
--   docker exec -i kallol-postgres psql -U kallol -d kallol_db < scripts/002_add_instamojo_columns.sql

-- Payment request ID returned by Instamojo when the online donation is created.
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS instamojo_payment_request_id TEXT;

-- Payment ID sent back on redirect/webhook once the donor completes (or fails) payment.
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS instamojo_payment_id TEXT;

-- Base64 PDF receipt generated after payment confirmation, so the webhook can
-- finalize receipts and the thank-you page can serve them without regenerating.
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS receipt_pdf_base64 TEXT;

-- Index for looking up donations by their Instamojo payment request ID (return/webhook handlers).
CREATE INDEX IF NOT EXISTS idx_donations_payment_request_id ON donations (instamojo_payment_request_id);

-- Index for the admin pending-donations bucket.
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations (status);
