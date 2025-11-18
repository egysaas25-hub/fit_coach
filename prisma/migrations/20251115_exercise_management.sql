-- Exercise Management System
-- Exercise library, categories, approval workflow, AI generation

-- Exercise categories
CREATE TABLE IF NOT EXISTS exercise_categories (
  category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Body parts
CREATE TABLE IF NOT EXISTS body_parts (
  body_part_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Muscle groups
CREATE TABLE IF NOT EXISTS muscle_groups (
  muscle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body_part_id UUID REFERENCES body_parts(body_part_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment types
CREATE TABLE IF NOT EXISTS equipment_types (
  equipment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  exercise_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  aliases TEXT[], -- alternative names
  description TEXT,
  instructions TEXT,
  category_id UUID REFERENCES exercise_categories(category_id),
  body_part_id UUID REFERENCES body_parts(body_part_id),
  primary_muscles UUID[] DEFAULT '{}', -- array of muscle_ids
  secondary_muscles UUID[] DEFAULT '{}',
  equipment_id UUID REFERENCES equipment_types(equipment_id),
  difficulty_level VARCHAR(50), -- beginner, intermediate, advanced, expert
  movement_pattern VARCHAR(100), -- push, pull, squat, hinge, carry, etc.
  
  -- Default parameters
  default_sets INTEGER DEFAULT 3,
  default_reps VARCHAR(50) DEFAULT '8-12',
  default_tempo VARCHAR(20), -- e.g., "3-1-1-0"
  default_rest_seconds INTEGER DEFAULT 60,
  
  -- Media
  video_url TEXT,
  thumbnail_url TEXT,
  images TEXT[], -- array of image URLs
  
  -- Safety & variations
  safety_notes TEXT,
  contraindications TEXT[],
  variations TEXT[], -- array of variation names
  
  -- Source tracking
  source VARCHAR(50) NOT NULL, -- global, custom, ai_generated
  ai_source BOOLEAN DEFAULT false,
  ai_prompt TEXT, -- original AI prompt if AI-generated
  created_by UUID REFERENCES team_members(member_id),
  
  -- Approval workflow
  status VARCHAR(50) DEFAULT 'draft', -- draft, pending_review, approved, rejected, deprecated
  reviewed_by UUID REFERENCES team_members(member_id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Visibility
  is_public BOOLEAN DEFAULT false, -- visible to all tenants (global only)
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_source CHECK (source IN ('global', 'custom', 'ai_generated'))
);

-- Indexes
CREATE INDEX idx_exercises_tenant ON exercises(tenant_id) WHERE tenant_id IS NOT NULL;
CREATE INDEX idx_exercises_category ON exercises(category_id);
CREATE INDEX idx_exercises_body_part ON exercises(body_part_id);
CREATE INDEX idx_exercises_equipment ON exercises(equipment_id);
CREATE INDEX idx_exercises_status ON exercises(status);
CREATE INDEX idx_exercises_source ON exercises(source);
CREATE INDEX idx_exercises_name ON exercises(name);
CREATE INDEX idx_exercises_search ON exercises USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Exercise usage tracking
CREATE TABLE IF NOT EXISTS exercise_usage (
  usage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(exercise_id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(plan_id) ON DELETE CASCADE,
  used_count INTEGER DEFAULT 1,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, exercise_id, plan_id)
);

CREATE INDEX idx_usage_tenant_exercise ON exercise_usage(tenant_id, exercise_id);
CREATE INDEX idx_usage_popular ON exercise_usage(tenant_id, used_count DESC);

-- Exercise ratings/feedback
CREATE TABLE IF NOT EXISTS exercise_ratings (
  rating_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(exercise_id) ON DELETE CASCADE,
  rated_by UUID NOT NULL REFERENCES team_members(member_id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, exercise_id, rated_by)
);

CREATE INDEX idx_ratings_exercise ON exercise_ratings(exercise_id);

-- Exercise approval history
CREATE TABLE IF NOT EXISTS exercise_approvals (
  approval_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(exercise_id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES team_members(member_id),
  reviewer_id UUID REFERENCES team_members(member_id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, changes_requested
  comments TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_approvals_pending ON exercise_approvals(tenant_id, status) WHERE status = 'pending';
CREATE INDEX idx_approvals_exercise ON exercise_approvals(exercise_id, created_at DESC);

-- AI generation logs
CREATE TABLE IF NOT EXISTS ai_generation_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  generated_by UUID REFERENCES team_members(member_id),
  generation_type VARCHAR(50) NOT NULL, -- exercise, nutrition, plan
  prompt TEXT NOT NULL,
  parameters JSONB,
  response JSONB,
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 4),
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_tenant ON ai_generation_logs(tenant_id, created_at DESC);
CREATE INDEX idx_ai_logs_type ON ai_generation_logs(generation_type, created_at DESC);

-- Insert default categories
INSERT INTO exercise_categories (name, description, sort_order) VALUES
('Strength', 'Resistance training exercises', 1),
('Cardio', 'Cardiovascular exercises', 2),
('Flexibility', 'Stretching and mobility exercises', 3),
('Plyometric', 'Explosive power exercises', 4),
('Core', 'Core stability and strength', 5),
('Balance', 'Balance and coordination', 6),
('Functional', 'Functional movement patterns', 7)
ON CONFLICT DO NOTHING;

-- Insert default body parts
INSERT INTO body_parts (name, description) VALUES
('Chest', 'Pectoral muscles'),
('Back', 'Upper and lower back muscles'),
('Shoulders', 'Deltoid muscles'),
('Arms', 'Biceps, triceps, forearms'),
('Legs', 'Quadriceps, hamstrings, calves'),
('Core', 'Abdominals and obliques'),
('Glutes', 'Gluteal muscles'),
('Full Body', 'Multiple muscle groups')
ON CONFLICT DO NOTHING;

-- Insert default equipment
INSERT INTO equipment_types (name, description) VALUES
('Barbell', 'Olympic barbell and weights'),
('Dumbbell', 'Free weights'),
('Kettlebell', 'Kettlebell weights'),
('Machine', 'Weight machines'),
('Cable', 'Cable machines'),
('Bodyweight', 'No equipment needed'),
('Resistance Band', 'Elastic resistance bands'),
('Medicine Ball', 'Weighted ball'),
('TRX', 'Suspension training'),
('Bench', 'Weight bench'),
('Pull-up Bar', 'Pull-up/chin-up bar'),
('Other', 'Other equipment')
ON CONFLICT DO NOTHING;

-- Add RLS policies
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_logs ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON exercises TO authenticated;
GRANT SELECT, INSERT, UPDATE ON exercise_usage TO authenticated;
GRANT SELECT, INSERT, UPDATE ON exercise_ratings TO authenticated;
GRANT SELECT, INSERT, UPDATE ON exercise_approvals TO authenticated;
GRANT SELECT, INSERT ON ai_generation_logs TO authenticated;
GRANT SELECT ON exercise_categories, body_parts, muscle_groups, equipment_types TO authenticated;

-- Comments
COMMENT ON TABLE exercises IS 'Exercise library with global, custom, and AI-generated exercises';
COMMENT ON COLUMN exercises.source IS 'global = platform-wide, custom = tenant-created, ai_generated = AI-created';
COMMENT ON COLUMN exercises.status IS 'Approval workflow status';
COMMENT ON TABLE ai_generation_logs IS 'Logs all AI generation requests for tracking and billing';
