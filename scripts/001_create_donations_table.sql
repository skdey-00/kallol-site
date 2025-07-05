-- Create the 'donations' table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gotra TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL, -- 'success' or 'failure'
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  qr_code_token TEXT UNIQUE,
  donation_items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { purpose, category, amount }
  qr_code_scans JSONB NOT NULL DEFAULT '[]'::jsonb -- Array of { timestamp, itemIndex }
);

-- Create an index on qr_code_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_donations_qr_code_token ON donations (qr_code_token);

-- Optional: Enable Row Level Security (RLS) if you plan to implement fine-grained access control
-- ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Optional: Create policies for RLS (example - adjust as needed for your application's security model)
-- CREATE POLICY "Enable read access for all users" ON donations FOR SELECT USING (TRUE);
-- CREATE POLICY "Enable insert for authenticated users" ON donations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
