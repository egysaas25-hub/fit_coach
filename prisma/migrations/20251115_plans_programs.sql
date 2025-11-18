-- Plans & Programs Infrastructure
-- Training plans, Nutrition plans, Versioning, Assignment, Auto-delivery

-- Plan types enum
CREATE TYPE plan_type AS ENUM ('training', 'nutrition', 'bundle');
CREATE TYPE plan_status AS ENUM ('draft', 'review', 'approved', 'published', 'deprecated');

-- Plans table (master record)
CREATE TABLE IF NOT EXISTS plans (
  plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  plan_type plan_type NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  current_version VARCHAR(20) DEFAULT '1.0',
  status plan_status DEFAULT 'draft',
  created_by UUID REFERENCES team_members(member_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plans_tenant ON plans(tenant_id, status);
CREATE INDEX idx_plans_type ON plans(tenant_id, plan_type);

-- Plan versions table
CREATE TABLE IF NOT EXISTS plan_versions (
  version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(plan_id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  version_number VARCHAR(20) NOT NULL,
  content JSONB NOT NULL, -- plan structure, exercises, meals, etc.
  change_log TEXT,
  is_current BOOLEAN DEFAULT false,
  created_by UUID REFERENCES team_members(member_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan_id, version_number)
);

CREATE INDEX idx_plan_versions_plan ON plan_versions(plan_id, created_at DESC);
CREATE INDEX idx_plan_versions_current ON plan_versions(plan_id) WHERE is_current = true;

-- Plan assignments (to clients or cohorts)
CREATE TABLE IF NOT EXISTS plan_assignments (
  assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(plan_id) ON DELETE CASCADE,
  version_id UUID NOT NULL REFERENCES plan_versions(version_id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(client_id) ON DELETE CASCADE,
  cohort_id UUID, -- reference to cohort if batch assignment
  assigned_by UUID REFERENCES team_members(member_id),
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- active, completed, cancelled
  delivery_status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, failed
  delivery_channel VARCHAR(50), -- whatsapp, email, portal
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assignments_client ON plan_assignments(client_id, status);
CREATE INDEX idx_assignments_plan ON plan_assignments(plan_id);
CREATE INDEX idx_assignments_delivery ON plan_assignments(tenant_id, delivery_status) WHERE delivery_status = 'pending';

-- Cohorts table (for batch plan assignments)
CREATE TABLE IF NOT EXISTS cohorts (
  cohort_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  filters JSONB NOT NULL, -- goal, level, round, renewal_stage, trainer_id
  client_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES team_members(member_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cohorts_tenant ON cohorts(tenant_id);

-- Check-in schedules (auto-generated from plan assignments)
CREATE TABLE IF NOT EXISTS checkin_schedules (
  schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES plan_assignments(assignment_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, submitted, reviewed, missed
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES team_members(member_id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checkins_client ON checkin_schedules(client_id, due_date DESC);
CREATE INDEX idx_checkins_due ON checkin_schedules(tenant_id, due_date, status) WHERE status = 'pending';

-- Plan approval workflow
CREATE TABLE IF NOT EXISTS plan_approvals (
  approval_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(plan_id) ON DELETE CASCADE,
  version_id UUID NOT NULL REFERENCES plan_versions(version_id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES team_members(member_id),
  reviewer_id UUID REFERENCES team_members(member_id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, changes_requested
  comments TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_approvals_pending ON plan_approvals(tenant_id, status) WHERE status = 'pending';
CREATE INDEX idx_approvals_plan ON plan_approvals(plan_id, created_at DESC);

-- Plan usage statistics
CREATE TABLE IF NOT EXISTS plan_usage_stats (
  stat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(plan_id) ON DELETE CASCADE,
  version_id UUID NOT NULL REFERENCES plan_versions(version_id) ON DELETE CASCADE,
  total_assignments INTEGER DEFAULT 0,
  active_assignments INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2),
  avg_adherence DECIMAL(5,2),
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan_id, version_id)
);

CREATE INDEX idx_plan_stats_plan ON plan_usage_stats(plan_id);

-- Function to bump plan version
CREATE OR REPLACE FUNCTION bump_plan_version(
  p_plan_id UUID,
  p_bump_type VARCHAR -- 'major' or 'minor'
)
RETURNS VARCHAR AS $$
DECLARE
  v_current_version VARCHAR(20);
  v_major INTEGER;
  v_minor INTEGER;
  v_new_version VARCHAR(20);
BEGIN
  -- Get current version
  SELECT current_version INTO v_current_version
  FROM plans WHERE plan_id = p_plan_id;
  
  -- Parse version
  v_major := CAST(SPLIT_PART(v_current_version, '.', 1) AS INTEGER);
  v_minor := CAST(SPLIT_PART(v_current_version, '.', 2) AS INTEGER);
  
  -- Bump version
  IF p_bump_type = 'major' THEN
    v_major := v_major + 1;
    v_minor := 0;
  ELSE
    v_minor := v_minor + 1;
  END IF;
  
  v_new_version := v_major || '.' || v_minor;
  
  -- Update plan
  UPDATE plans SET current_version = v_new_version WHERE plan_id = p_plan_id;
  
  -- Mark old version as not current
  UPDATE plan_versions SET is_current = false WHERE plan_id = p_plan_id;
  
  RETURN v_new_version;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_usage_stats ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON plans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON plan_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON plan_assignments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON cohorts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON checkin_schedules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON plan_approvals TO authenticated;
GRANT SELECT, UPDATE ON plan_usage_stats TO authenticated;
