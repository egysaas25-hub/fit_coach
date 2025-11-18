-- Team Management System
-- Page-level access control, workload tracking, SLA compliance

-- Page access control matrix
CREATE TABLE IF NOT EXISTS page_access_control (
  access_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- admin, superior, senior, junior, sales, cs, marketing, analyst
  page_path VARCHAR(255) NOT NULL, -- /admin/clients, /admin/programs, etc.
  can_view BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_export BOOLEAN DEFAULT false,
  can_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, role, page_path)
);

CREATE INDEX idx_page_access_tenant_role ON page_access_control(tenant_id, role);
CREATE INDEX idx_page_access_path ON page_access_control(page_path);

-- Team member workload tracking
CREATE TABLE IF NOT EXISTS team_workload (
  workload_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES team_members(member_id) ON DELETE CASCADE,
  
  -- Client assignments
  assigned_clients INTEGER DEFAULT 0,
  max_clients INTEGER DEFAULT 50,
  
  -- Activity metrics
  active_plans INTEGER DEFAULT 0,
  pending_approvals INTEGER DEFAULT 0,
  unread_messages INTEGER DEFAULT 0,
  overdue_tasks INTEGER DEFAULT 0,
  
  -- Workload index (0-100)
  workload_index DECIMAL(5, 2) DEFAULT 0,
  
  -- Availability
  is_available BOOLEAN DEFAULT true,
  availability_notes TEXT,
  
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, member_id)
);

CREATE INDEX idx_workload_tenant ON team_workload(tenant_id);
CREATE INDEX idx_workload_member ON team_workload(member_id);
CREATE INDEX idx_workload_index ON team_workload(tenant_id, workload_index);

-- SLA tracking
CREATE TABLE IF NOT EXISTS sla_metrics (
  metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES team_members(member_id) ON DELETE CASCADE,
  
  metric_date DATE NOT NULL,
  
  -- Response time metrics
  avg_response_time_minutes DECIMAL(10, 2),
  median_response_time_minutes DECIMAL(10, 2),
  response_within_5min INTEGER DEFAULT 0,
  response_within_30min INTEGER DEFAULT 0,
  response_within_1hour INTEGER DEFAULT 0,
  response_over_1hour INTEGER DEFAULT 0,
  total_responses INTEGER DEFAULT 0,
  
  -- SLA compliance
  sla_target_minutes INTEGER DEFAULT 5,
  sla_compliance_percent DECIMAL(5, 2),
  
  -- Activity metrics
  messages_sent INTEGER DEFAULT 0,
  plans_created INTEGER DEFAULT 0,
  clients_onboarded INTEGER DEFAULT 0,
  check_ins_reviewed INTEGER DEFAULT 0,
  
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, member_id, metric_date)
);

CREATE INDEX idx_sla_tenant_date ON sla_metrics(tenant_id, metric_date DESC);
CREATE INDEX idx_sla_member_date ON sla_metrics(member_id, metric_date DESC);
CREATE INDEX idx_sla_compliance ON sla_metrics(tenant_id, sla_compliance_percent);

-- Team performance leaderboard
CREATE TABLE IF NOT EXISTS team_performance (
  performance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES team_members(member_id) ON DELETE CASCADE,
  
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- KPI scores (0-100)
  response_time_score DECIMAL(5, 2) DEFAULT 0,
  client_satisfaction_score DECIMAL(5, 2) DEFAULT 0,
  adherence_improvement_score DECIMAL(5, 2) DEFAULT 0,
  plan_quality_score DECIMAL(5, 2) DEFAULT 0,
  
  -- Overall performance score
  overall_score DECIMAL(5, 2) DEFAULT 0,
  
  -- Ranking
  rank INTEGER,
  
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, member_id, period_start, period_end)
);

CREATE INDEX idx_performance_tenant_period ON team_performance(tenant_id, period_start DESC);
CREATE INDEX idx_performance_rank ON team_performance(tenant_id, rank);

-- Auto-assign rules
CREATE TABLE IF NOT EXISTS auto_assign_rules (
  rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Assignment criteria
  criteria JSONB NOT NULL, -- {goal: "weight_loss", level: "beginner", ...}
  
  -- Assignment strategy
  strategy VARCHAR(50) NOT NULL, -- round_robin, least_loaded, skill_match, random
  
  -- Target team members
  target_members UUID[], -- array of member_ids, null = all available
  
  -- Priority
  priority INTEGER DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  
  created_by UUID REFERENCES team_members(member_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_auto_assign_tenant ON auto_assign_rules(tenant_id, is_active);
CREATE INDEX idx_auto_assign_priority ON auto_assign_rules(tenant_id, priority DESC);

-- Insert default page access for roles
INSERT INTO page_access_control (tenant_id, role, page_path, can_view, can_edit, can_export, can_admin)
SELECT 
  t.tenant_id,
  role,
  page_path,
  can_view,
  can_edit,
  can_export,
  can_admin
FROM tenants t
CROSS JOIN (VALUES
  -- Admin: Full access
  ('admin', '/admin/dashboard', true, true, true, true),
  ('admin', '/admin/clients', true, true, true, true),
  ('admin', '/admin/communication', true, true, true, true),
  ('admin', '/admin/programs', true, true, true, true),
  ('admin', '/admin/exercises', true, true, true, true),
  ('admin', '/admin/nutrition', true, true, true, true),
  ('admin', '/admin/teams', true, true, true, true),
  ('admin', '/admin/analytics', true, true, true, true),
  ('admin', '/admin/settings', true, true, true, true),
  
  -- Superior: Most access
  ('superior', '/admin/dashboard', true, true, true, false),
  ('superior', '/admin/clients', true, true, true, false),
  ('superior', '/admin/communication', true, true, true, false),
  ('superior', '/admin/programs', true, true, true, false),
  ('superior', '/admin/exercises', true, true, false, false),
  ('superior', '/admin/nutrition', true, true, false, false),
  ('superior', '/admin/teams', true, false, false, false),
  ('superior', '/admin/analytics', true, false, true, false),
  
  -- Senior: Standard access
  ('senior', '/admin/dashboard', true, false, false, false),
  ('senior', '/admin/clients', true, true, true, false),
  ('senior', '/admin/communication', true, true, false, false),
  ('senior', '/admin/programs', true, true, false, false),
  ('senior', '/admin/exercises', true, false, false, false),
  ('senior', '/admin/nutrition', true, false, false, false),
  
  -- Junior: Limited access
  ('junior', '/admin/dashboard', true, false, false, false),
  ('junior', '/admin/clients', true, false, false, false),
  ('junior', '/admin/communication', true, true, false, false),
  ('junior', '/admin/programs', true, false, false, false),
  ('junior', '/admin/exercises', true, false, false, false),
  ('junior', '/admin/nutrition', true, false, false, false)
) AS defaults(role, page_path, can_view, can_edit, can_export, can_admin)
ON CONFLICT DO NOTHING;

-- Function to calculate workload index
CREATE OR REPLACE FUNCTION calculate_workload_index(p_member_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_workload RECORD;
  v_index DECIMAL;
BEGIN
  SELECT 
    assigned_clients,
    max_clients,
    active_plans,
    pending_approvals,
    unread_messages,
    overdue_tasks
  INTO v_workload
  FROM team_workload
  WHERE member_id = p_member_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Calculate index (0-100)
  -- 50% based on client load
  -- 20% based on active plans
  -- 15% based on pending approvals
  -- 10% based on unread messages
  -- 5% based on overdue tasks
  
  v_index := 
    (v_workload.assigned_clients::DECIMAL / NULLIF(v_workload.max_clients, 0) * 50) +
    (LEAST(v_workload.active_plans, 20)::DECIMAL / 20 * 20) +
    (LEAST(v_workload.pending_approvals, 10)::DECIMAL / 10 * 15) +
    (LEAST(v_workload.unread_messages, 50)::DECIMAL / 50 * 10) +
    (LEAST(v_workload.overdue_tasks, 5)::DECIMAL / 5 * 5);
  
  -- Update workload table
  UPDATE team_workload
  SET 
    workload_index = v_index,
    last_calculated_at = NOW()
  WHERE member_id = p_member_id;
  
  RETURN v_index;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-assign client to trainer
CREATE OR REPLACE FUNCTION auto_assign_client(
  p_tenant_id UUID,
  p_client_id UUID,
  p_criteria JSONB
)
RETURNS UUID AS $$
DECLARE
  v_member_id UUID;
  v_strategy VARCHAR(50);
BEGIN
  -- Get active auto-assign rule
  SELECT strategy INTO v_strategy
  FROM auto_assign_rules
  WHERE tenant_id = p_tenant_id
    AND is_active = true
  ORDER BY priority DESC
  LIMIT 1;
  
  IF v_strategy IS NULL THEN
    v_strategy := 'least_loaded';
  END IF;
  
  -- Apply strategy
  CASE v_strategy
    WHEN 'least_loaded' THEN
      -- Assign to trainer with lowest workload
      SELECT tw.member_id INTO v_member_id
      FROM team_workload tw
      JOIN team_members tm ON tw.member_id = tm.member_id
      WHERE tw.tenant_id = p_tenant_id
        AND tw.is_available = true
        AND tm.is_active = true
      ORDER BY tw.workload_index ASC
      LIMIT 1;
      
    WHEN 'round_robin' THEN
      -- Assign to next trainer in rotation
      SELECT tm.member_id INTO v_member_id
      FROM team_members tm
      LEFT JOIN (
        SELECT assigned_to, COUNT(*) as count
        FROM clients
        WHERE tenant_id = p_tenant_id
        GROUP BY assigned_to
      ) c ON tm.member_id = c.assigned_to
      WHERE tm.tenant_id = p_tenant_id
        AND tm.is_active = true
      ORDER BY COALESCE(c.count, 0) ASC
      LIMIT 1;
      
    ELSE
      -- Default: least loaded
      SELECT tw.member_id INTO v_member_id
      FROM team_workload tw
      WHERE tw.tenant_id = p_tenant_id
        AND tw.is_available = true
      ORDER BY tw.workload_index ASC
      LIMIT 1;
  END CASE;
  
  RETURN v_member_id;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE page_access_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_workload ENABLE ROW LEVEL SECURITY;
ALTER TABLE sla_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_assign_rules ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON page_access_control TO authenticated;
GRANT SELECT, UPDATE ON team_workload TO authenticated;
GRANT SELECT ON sla_metrics TO authenticated;
GRANT SELECT ON team_performance TO authenticated;
GRANT SELECT, INSERT, UPDATE ON auto_assign_rules TO authenticated;

-- Comments
COMMENT ON TABLE page_access_control IS 'Page-level access control matrix per role';
COMMENT ON TABLE team_workload IS 'Real-time workload tracking for team members';
COMMENT ON TABLE sla_metrics IS 'SLA compliance and response time tracking';
COMMENT ON TABLE team_performance IS 'Performance scores and leaderboard';
COMMENT ON COLUMN team_workload.workload_index IS 'Calculated workload score (0-100)';
COMMENT ON COLUMN sla_metrics.sla_compliance_percent IS 'Percentage of responses within SLA target';
