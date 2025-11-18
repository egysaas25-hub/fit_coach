-- Create OTP codes table for WhatsApp authentication
CREATE TABLE IF NOT EXISTS otp_codes (
  phone VARCHAR(20) PRIMARY KEY,
  code_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for cleanup
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON otp_codes(expires_at);

-- Add phone_primary column to team_members if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'team_members' AND column_name = 'phone_primary'
  ) THEN
    ALTER TABLE team_members ADD COLUMN phone_primary VARCHAR(20);
    CREATE INDEX idx_team_members_phone ON team_members(phone_primary);
  END IF;
END $$;
