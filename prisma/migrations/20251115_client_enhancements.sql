-- Client Management Enhancements
-- ClientCode system, KYC automation, Social handles, Lifecycle stages

-- Add ClientCode and enhanced fields to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS client_code VARCHAR(20) UNIQUE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS lifecycle_stage VARCHAR(50) DEFAULT 'lead';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_contact_at TIMESTAMPTZ;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS engagement_score INTEGER DEFAULT 0;

-- Social handles table
CREATE TABLE IF NOT EXISTS client_social_handles (
  handle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- instagram, facebook, telegram, signal, tiktok
  handle VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, platform, handle)
);

CREATE INDEX idx_social_handles_client ON client_social_handles(client_id);
CREATE INDEX idx_social_handles_platform ON client_social_handles(tenant_id, platform, handle);

-- KYC data table
CREATE TABLE IF NOT EXISTS client_kyc (
  kyc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, submitted, verified, rejected
  data JSONB NOT NULL, -- collected KYC data
  consent_given BOOLEAN DEFAULT false,
  consent_timestamp TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES team_members(member_id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id)
);

CREATE INDEX idx_kyc_status ON client_kyc(tenant_id, status);

-- Persistent notifications table
CREATE TABLE IF NOT EXISTS persistent_notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES team_members(member_id), -- null = all staff
  notification_type VARCHAR(100) NOT NULL, -- kyc_ready, plan_due, renewal_due, etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500),
  action_label VARCHAR(100),
  related_entity_type VARCHAR(50), -- client, plan, subscription, etc.
  related_entity_id UUID,
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  auto_dismiss_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_recipient ON persistent_notifications(recipient_id, is_dismissed, created_at DESC);
CREATE INDEX idx_notifications_tenant ON persistent_notifications(tenant_id, is_dismissed, created_at DESC);
CREATE INDEX idx_notifications_type ON persistent_notifications(tenant_id, notification_type, is_dismissed);

-- Client lifecycle history
CREATE TABLE IF NOT EXISTS client_lifecycle_history (
  history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  from_stage VARCHAR(50),
  to_stage VARCHAR(50) NOT NULL,
  changed_by UUID REFERENCES team_members(member_id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lifecycle_history_client ON client_lifecycle_history(client_id, created_at DESC);

-- Client duplicate detection table
CREATE TABLE IF NOT EXISTS client_duplicates (
  duplicate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id_1 UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  client_id_2 UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  similarity_score DECIMAL(5,2), -- 0-100
  match_fields JSONB, -- which fields matched
  status VARCHAR(50) DEFAULT 'pending', -- pending, merged, ignored
  resolved_by UUID REFERENCES team_members(member_id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (client_id_1 < client_id_2) -- ensure consistent ordering
);

CREATE INDEX idx_duplicates_pending ON client_duplicates(tenant_id, status) WHERE status = 'pending';

-- Function to generate ClientCode
CREATE OR REPLACE FUNCTION generate_client_code(p_tenant_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  v_code VARCHAR(20);
  v_counter INTEGER;
  v_exists BOOLEAN;
BEGIN
  -- Get the next counter for this tenant
  SELECT COALESCE(MAX(CAST(SUBSTRING(client_code FROM 2) AS INTEGER)), 0) + 1
  INTO v_counter
  FROM clients
  WHERE tenant_id = p_tenant_id AND client_code IS NOT NULL;
  
  -- Generate code in format C001, C002, etc.
  v_code := 'C' || LPAD(v_counter::TEXT, 3, '0');
  
  -- Check if it exists (shouldn't happen, but safety check)
  SELECT EXISTS(SELECT 1 FROM clients WHERE client_code = v_code) INTO v_exists;
  
  IF v_exists THEN
    -- Fallback to UUID-based code
    v_code := 'C' || SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 6);
  END IF;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ClientCode on insert
CREATE OR REPLACE FUNCTION set_client_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.client_code IS NULL THEN
    NEW.client_code := generate_client_code(NEW.tenant_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_client_code
BEFORE INSERT ON clients
FOR EACH ROW
EXECUTE FUNCTION set_client_code();

-- Add RLS policies
ALTER TABLE client_social_handles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE persistent_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_lifecycle_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_duplicates ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON client_social_handles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON client_kyc TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON persistent_notifications TO authenticated;
GRANT SELECT, INSERT ON client_lifecycle_history TO authenticated;
GRANT SELECT, INSERT, UPDATE ON client_duplicates TO authenticated;
