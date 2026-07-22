-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the 'donations' table
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
  status TEXT NOT NULL, -- 'success' or 'failure'
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  qr_code_token TEXT UNIQUE,
  donation_items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { purpose, category, amount }
  qr_code_scans JSONB NOT NULL DEFAULT '[]'::jsonb -- Array of { timestamp, itemIndex, photo_id }
);

-- Create an index on qr_code_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_donations_qr_code_token ON donations (qr_code_token);

-- Create the 'scan_photos' table for storing photo BLOB data
CREATE TABLE IF NOT EXISTS scan_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  photo_data BYTEA NOT NULL, -- BLOB data for the photo
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for photo queries
CREATE INDEX IF NOT EXISTS idx_scan_photos_donation_id ON scan_photos(donation_id);
CREATE INDEX IF NOT EXISTS idx_scan_photos_created_at ON scan_photos(created_at DESC);
