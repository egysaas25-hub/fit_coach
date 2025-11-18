-- Progress Tracking System
-- Body metrics, milestones, achievements, progress reports

-- Body metrics tracking
CREATE TABLE IF NOT EXISTS body_metrics (
  metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES plan_assignments(assignment_id) ON DELETE SET NULL,
  
  measurement_date DATE NOT NULL,
  
  -- Weight and composition
  weight_kg DECIMAL(5, 2),
  body_fat_percent DECIMAL(4, 2),
  muscle_mass_kg DECIMAL(5, 2),
  bmi DECIMAL(4, 2),
  
  -- Measurements (cm)
  neck_cm DECIMAL(5, 2),
  chest_cm DECIMAL(5, 2),
  waist_cm DECIMAL(5, 2),
  hips_cm DECIMAL(5, 2),
  thigh_left_cm DECIMAL(5, 2),
  thigh_right_cm DECIMAL(5, 2),
  calf_left_cm DECIMAL(5, 2),
  calf_right_cm DECIMAL(5, 2),
  bicep_left_cm DECIMAL(5, 2),
  bicep_right_cm DECIMAL(5, 2),
  forearm_left_cm DECIMAL(5, 2),
  forearm_right_cm DECIMAL(5, 2),
  
  -- InBody metrics (if available)
  inbody_score INTEGER,
  skeletal_muscle_mass_kg DECIMAL(5, 2),
  body_fat_mass_kg DECIMAL(5, 2),
  total_body_water_kg DECIMAL(5, 2),
  protein_kg DECIMAL(5, 2),
  mineral_kg DECIMAL(5, 2),
  visceral_fat_level INTEGER,
  
  -- Photos
  front_photo_url TEXT,
  side_photo_url TEXT,
  back_photo_url TEXT,
  
  -- Notes
  notes TEXT,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  
  -- Metadata
  measured_by UUID REFERENCES team_members(member_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_body_metrics_client ON body_metrics(client_id, measurement_date DESC);
CREATE INDEX idx_body_metrics_assignment ON body_metrics(assignment_id);
CREATE INDEX idx_body_metrics_date ON body_metrics(tenant_id, measurement_date DESC);

-- Milestones and achievements
CREATE TABLE IF NOT EXISTS milestones (
  milestone_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES plan_assignments(assignment_id) ON DELETE SET NULL,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Target metrics
  target_type VARCHAR(50) NOT NULL, -- weight, body_fat, measurement, workout, nutrition
  target_metric VARCHAR(100), -- specific metric name
  target_value DECIMAL(10, 2),
  target_unit VARCHAR(20),
  
  -- Current progress
  current_value DECIMAL(10, 2),
  progress_percent DECIMAL(5, 2) DEFAULT 0,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- active, completed, cancelled
  
  -- Dates
  start_date DATE,
  target_date DATE,
  completed_at TIMESTAMPTZ,
  
  -- Reward/recognition
  badge_icon VARCHAR(100),
  celebration_message TEXT,
  
  created_by UUID REFERENCES team_members(member_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_milestones_client ON milestones(client_id, status);
CREATE INDEX idx_milestones_assignment ON milestones(assignment_id);
CREATE INDEX idx_milestones_status ON milestones(tenant_id, status);

-- Progress snapshots (weekly/monthly summaries)
CREATE TABLE IF NOT EXISTS progress_snapshots (
  snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES plan_assignments(assignment_id) ON DELETE SET NULL,
  
  snapshot_date DATE NOT NULL,
  period_type VARCHAR(20) NOT NULL, -- weekly, monthly, quarterly
  
  -- Body metrics changes
  weight_change_kg DECIMAL(5, 2),
  body_fat_change_percent DECIMAL(4, 2),
  muscle_mass_change_kg DECIMAL(5, 2),
  
  -- Adherence metrics
  workout_adherence_percent DECIMAL(5, 2),
  nutrition_adherence_percent DECIMAL(5, 2),
  overall_adherence_percent DECIMAL(5, 2),
  
  -- Activity summary
  workouts_completed INTEGER DEFAULT 0,
  workouts_planned INTEGER DEFAULT 0,
  meals_logged INTEGER DEFAULT 0,
  check_ins_completed INTEGER DEFAULT 0,
  
  -- Milestones
  milestones_achieved INTEGER DEFAULT 0,
  
  -- Trainer notes
  trainer_notes TEXT,
  trainer_rating INTEGER CHECK (trainer_rating >= 1 AND trainer_rating <= 5),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(client_id, assignment_id, snapshot_date, period_type)
);

CREATE INDEX idx_snapshots_client ON progress_snapshots(client_id, snapshot_date DESC);
CREATE INDEX idx_snapshots_assignment ON progress_snapshots(assignment_id);

-- Progress reports
CREATE TABLE IF NOT EXISTS progress_reports (
  report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES plan_assignments(assignment_id) ON DELETE SET NULL,
  
  report_name VARCHAR(255) NOT NULL,
  report_type VARCHAR(50) NOT NULL, -- summary, detailed, comparative
  
  -- Date range
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Sections included
  include_body_metrics BOOLEAN DEFAULT true,
  include_workouts BOOLEAN DEFAULT true,
  include_nutrition BOOLEAN DEFAULT true,
  include_milestones BOOLEAN DEFAULT true,
  include_photos BOOLEAN DEFAULT true,
  
  -- Report data (generated)
  report_data JSONB,
  
  -- Export
  pdf_url TEXT,
  excel_url TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, generating, completed, failed
  
  generated_by UUID REFERENCES team_members(member_id),
  generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_client ON progress_reports(client_id, created_at DESC);
CREATE INDEX idx_reports_status ON progress_reports(tenant_id, status);

-- Workout logs (for adherence tracking)
CREATE TABLE IF NOT EXISTS workout_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES plan_assignments(assignment_id) ON DELETE SET NULL,
  
  workout_date DATE NOT NULL,
  
  -- Workout details
  exercises JSONB NOT NULL, -- [{exercise_id, sets, reps, weight, notes}, ...]
  
  -- Duration and intensity
  duration_minutes INTEGER,
  intensity_level INTEGER CHECK (intensity_level >= 1 AND intensity_level <= 10),
  
  -- Completion
  is_completed BOOLEAN DEFAULT true,
  completion_percent DECIMAL(5, 2) DEFAULT 100,
  
  -- Feedback
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  notes TEXT,
  
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workout_logs_client ON workout_logs(client_id, workout_date DESC);
CREATE INDEX idx_workout_logs_assignment ON workout_logs(assignment_id);

-- Achievement badges
CREATE TABLE IF NOT EXISTS achievement_badges (
  badge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  
  -- Criteria
  criteria_type VARCHAR(50) NOT NULL, -- weight_loss, consistency, milestone, streak
  criteria_value DECIMAL(10, 2),
  
  -- Rarity
  rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_badges_tenant ON achievement_badges(tenant_id, is_active);

-- Client achievements (earned badges)
CREATE TABLE IF NOT EXISTS client_achievements (
  achievement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES achievement_badges(badge_id) ON DELETE CASCADE,
  
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(client_id, badge_id)
);

CREATE INDEX idx_achievements_client ON client_achievements(client_id, earned_at DESC);

-- Insert default achievement badges
INSERT INTO achievement_badges (name, description, icon, criteria_type, criteria_value, rarity) VALUES
('First Workout', 'Completed your first workout', '💪', 'consistency', 1, 'common'),
('Week Warrior', 'Completed 7 consecutive days', '🔥', 'streak', 7, 'common'),
('Month Master', 'Completed 30 consecutive days', '⭐', 'streak', 30, 'rare'),
('5kg Lost', 'Lost 5kg of weight', '🎯', 'weight_loss', 5, 'common'),
('10kg Lost', 'Lost 10kg of weight', '🏆', 'weight_loss', 10, 'rare'),
('20kg Lost', 'Lost 20kg of weight', '👑', 'weight_loss', 20, 'epic'),
('Milestone Master', 'Achieved 5 milestones', '🌟', 'milestone', 5, 'rare'),
('Perfect Week', 'Perfect adherence for 7 days', '💯', 'consistency', 100, 'rare')
ON CONFLICT DO NOTHING;

-- Function to calculate progress percentage
CREATE OR REPLACE FUNCTION calculate_progress_percent(
  p_current_value DECIMAL,
  p_target_value DECIMAL,
  p_start_value DECIMAL DEFAULT 0
)
RETURNS DECIMAL AS $$
BEGIN
  IF p_target_value = p_start_value THEN
    RETURN 100;
  END IF;
  
  RETURN LEAST(100, GREATEST(0, 
    ((p_current_value - p_start_value) / (p_target_value - p_start_value) * 100)
  ));
END;
$$ LANGUAGE plpgsql;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements(p_client_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
  v_badge RECORD;
BEGIN
  -- Check each badge criteria
  FOR v_badge IN 
    SELECT * FROM achievement_badges WHERE is_active = true
  LOOP
    -- Check if already earned
    IF EXISTS (
      SELECT 1 FROM client_achievements 
      WHERE client_id = p_client_id AND badge_id = v_badge.badge_id
    ) THEN
      CONTINUE;
    END IF;
    
    -- Check criteria (simplified - expand based on criteria_type)
    CASE v_badge.criteria_type
      WHEN 'consistency' THEN
        -- Check workout count
        IF (SELECT COUNT(*) FROM workout_logs WHERE client_id = p_client_id) >= v_badge.criteria_value THEN
          INSERT INTO client_achievements (tenant_id, client_id, badge_id)
          SELECT tenant_id, p_client_id, v_badge.badge_id
          FROM clients WHERE client_id = p_client_id;
          v_count := v_count + 1;
        END IF;
      -- Add more criteria types as needed
    END CASE;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_achievements ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON body_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE ON milestones TO authenticated;
GRANT SELECT, INSERT ON progress_snapshots TO authenticated;
GRANT SELECT, INSERT, UPDATE ON progress_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE ON workout_logs TO authenticated;
GRANT SELECT ON achievement_badges TO authenticated;
GRANT SELECT, INSERT ON client_achievements TO authenticated;

-- Comments
COMMENT ON TABLE body_metrics IS 'Body measurements and composition tracking';
COMMENT ON TABLE milestones IS 'Client goals and achievement tracking';
COMMENT ON TABLE progress_snapshots IS 'Weekly/monthly progress summaries';
COMMENT ON TABLE progress_reports IS 'Generated progress reports (PDF/Excel)';
COMMENT ON TABLE workout_logs IS 'Client workout completion tracking';
COMMENT ON TABLE achievement_badges IS 'Available achievement badges';
COMMENT ON TABLE client_achievements IS 'Badges earned by clients';
