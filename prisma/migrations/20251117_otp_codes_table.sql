-- Migration: Add OTP Codes Table for WhatsApp Authentication
-- Date: 2025-11-17
-- Purpose: Store OTP codes for phone-based authentication with WhatsApp

-- Create otp_codes table
CREATE TABLE IF NOT EXISTS otp_codes (
    id BIGSERIAL PRIMARY KEY,
    phone_e164 VARCHAR(20) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_otp_phone_expires ON otp_codes(phone_e164, expires_at);

-- Add comment
COMMENT ON TABLE otp_codes IS 'Stores hashed OTP codes for WhatsApp-based authentication';
COMMENT ON COLUMN otp_codes.phone_e164 IS 'Phone number in E.164 format (+[country][number])';
COMMENT ON COLUMN otp_codes.code_hash IS 'Bcrypt hash of the 6-digit OTP code';
COMMENT ON COLUMN otp_codes.expires_at IS 'Expiration timestamp (2 minutes from creation)';
COMMENT ON COLUMN otp_codes.attempts IS 'Number of failed verification attempts';
