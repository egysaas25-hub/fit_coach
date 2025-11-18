-- Nutrition Management System
-- Food database, meal plans, AI generation, macro tracking

-- Food categories
CREATE TABLE IF NOT EXISTS food_categories (
  category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foods database
CREATE TABLE IF NOT EXISTS foods (
  food_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  category_id UUID REFERENCES food_categories(category_id),
  
  -- Nutritional information (per 100g or per serving)
  serving_size DECIMAL(10, 2) NOT NULL, -- in grams
  serving_unit VARCHAR(50) DEFAULT 'g', -- g, ml, piece, cup, etc.
  
  calories DECIMAL(10, 2) NOT NULL,
  protein DECIMAL(10, 2) NOT NULL,
  carbs DECIMAL(10, 2) NOT NULL,
  fat DECIMAL(10, 2) NOT NULL,
  fiber DECIMAL(10, 2) DEFAULT 0,
  sugar DECIMAL(10, 2) DEFAULT 0,
  sodium DECIMAL(10, 2) DEFAULT 0, -- in mg
  
  -- Micronutrients (optional)
  vitamins JSONB, -- {vitamin_a: 100, vitamin_c: 50, ...}
  minerals JSONB, -- {calcium: 200, iron: 5, ...}
  
  -- Source tracking
  source VARCHAR(50) NOT NULL, -- usda, custom, ai_generated
  external_id VARCHAR(255), -- USDA FDC ID or other external reference
  
  -- Dietary flags
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_dairy_free BOOLEAN DEFAULT false,
  is_keto_friendly BOOLEAN DEFAULT false,
  
  -- Allergens
  allergens TEXT[], -- dairy, eggs, fish, shellfish, tree nuts, peanuts, wheat, soy
  
  -- Status
  status VARCHAR(50) DEFAULT 'approved', -- draft, pending_review, approved, rejected
  is_active BOOLEAN DEFAULT true,
  
  created_by UUID REFERENCES team_members(member_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_source CHECK (source IN ('usda', 'custom', 'ai_generated'))
);

-- Indexes
CREATE INDEX idx_foods_tenant ON foods(tenant_id) WHERE tenant_id IS NOT NULL;
CREATE INDEX idx_foods_category ON foods(category_id);
CREATE INDEX idx_foods_source ON foods(source);
CREATE INDEX idx_foods_name ON foods(name);
CREATE INDEX idx_foods_search ON foods USING gin(to_tsvector('english', name || ' ' || COALESCE(brand, '')));
CREATE INDEX idx_foods_dietary ON foods(is_vegetarian, is_vegan, is_gluten_free, is_dairy_free, is_keto_friendly);

-- Meal templates
CREATE TABLE IF NOT EXISTS meal_templates (
  template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  meal_type VARCHAR(50), -- breakfast, lunch, dinner, snack
  
  -- Target macros
  target_calories INTEGER,
  target_protein INTEGER,
  target_carbs INTEGER,
  target_fat INTEGER,
  
  -- Dietary preferences
  dietary_type VARCHAR(50), -- standard, vegetarian, vegan, keto, paleo, etc.
  
  -- Foods in template
  foods JSONB NOT NULL, -- [{food_id, quantity, unit}, ...]
  
  -- Calculated totals
  total_calories DECIMAL(10, 2),
  total_protein DECIMAL(10, 2),
  total_carbs DECIMAL(10, 2),
  total_fat DECIMAL(10, 2),
  
  -- Status
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  created_by UUID REFERENCES team_members(member_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meal_templates_tenant ON meal_templates(tenant_id);
CREATE INDEX idx_meal_templates_type ON meal_templates(meal_type);
CREATE INDEX idx_meal_templates_dietary ON meal_templates(dietary_type);

-- Nutrition plans (stored in plans table with plan_type='nutrition')
-- Additional nutrition-specific data stored here
CREATE TABLE IF NOT EXISTS nutrition_plan_details (
  detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(plan_id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  
  -- Macro split
  protein_percent INTEGER NOT NULL CHECK (protein_percent >= 0 AND protein_percent <= 100),
  carbs_percent INTEGER NOT NULL CHECK (carbs_percent >= 0 AND carbs_percent <= 100),
  fat_percent INTEGER NOT NULL CHECK (fat_percent >= 0 AND fat_percent <= 100),
  total_calories INTEGER NOT NULL,
  
  -- Meal structure
  meals_per_day INTEGER DEFAULT 3 CHECK (meals_per_day >= 1 AND meals_per_day <= 8),
  meal_schedule JSONB, -- [{meal_type, time, calories}, ...]
  
  -- Dietary preferences
  dietary_type VARCHAR(50), -- standard, vegetarian, vegan, keto, paleo
  allergies TEXT[],
  dislikes TEXT[],
  preferences TEXT,
  
  -- Hydration
  water_intake_ml INTEGER,
  
  -- Supplements
  supplements JSONB, -- [{name, dosage, timing}, ...]
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_macro_sum CHECK (protein_percent + carbs_percent + fat_percent = 100)
);

CREATE INDEX idx_nutrition_details_plan ON nutrition_plan_details(plan_id);
CREATE INDEX idx_nutrition_details_tenant ON nutrition_plan_details(tenant_id);

-- Client meal logs (for tracking adherence)
CREATE TABLE IF NOT EXISTS client_meal_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES plan_assignments(assignment_id) ON DELETE CASCADE,
  
  log_date DATE NOT NULL,
  meal_type VARCHAR(50) NOT NULL, -- breakfast, lunch, dinner, snack
  
  -- Foods consumed
  foods JSONB NOT NULL, -- [{food_id, quantity, unit}, ...]
  
  -- Calculated totals
  total_calories DECIMAL(10, 2),
  total_protein DECIMAL(10, 2),
  total_carbs DECIMAL(10, 2),
  total_fat DECIMAL(10, 2),
  
  -- Notes
  notes TEXT,
  photos TEXT[], -- array of photo URLs
  
  -- Timing
  consumed_at TIMESTAMPTZ,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meal_logs_client ON client_meal_logs(client_id, log_date DESC);
CREATE INDEX idx_meal_logs_assignment ON client_meal_logs(assignment_id);
CREATE INDEX idx_meal_logs_date ON client_meal_logs(tenant_id, log_date DESC);

-- Nutrition adherence tracking
CREATE TABLE IF NOT EXISTS nutrition_adherence (
  adherence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES plan_assignments(assignment_id) ON DELETE CASCADE,
  
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  
  -- Adherence metrics
  days_logged INTEGER DEFAULT 0,
  meals_logged INTEGER DEFAULT 0,
  target_meals INTEGER,
  adherence_percent DECIMAL(5, 2),
  
  -- Macro adherence
  avg_calories DECIMAL(10, 2),
  avg_protein DECIMAL(10, 2),
  avg_carbs DECIMAL(10, 2),
  avg_fat DECIMAL(10, 2),
  
  target_calories INTEGER,
  target_protein INTEGER,
  target_carbs INTEGER,
  target_fat INTEGER,
  
  -- Variance from targets
  calorie_variance_percent DECIMAL(5, 2),
  protein_variance_percent DECIMAL(5, 2),
  carbs_variance_percent DECIMAL(5, 2),
  fat_variance_percent DECIMAL(5, 2),
  
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(client_id, assignment_id, week_start_date)
);

CREATE INDEX idx_adherence_client ON nutrition_adherence(client_id, week_start_date DESC);
CREATE INDEX idx_adherence_assignment ON nutrition_adherence(assignment_id);

-- Food ratings/feedback
CREATE TABLE IF NOT EXISTS food_ratings (
  rating_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(food_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, food_id, client_id)
);

CREATE INDEX idx_food_ratings_food ON food_ratings(food_id);
CREATE INDEX idx_food_ratings_client ON food_ratings(client_id);

-- Insert default food categories
INSERT INTO food_categories (name, description, sort_order) VALUES
('Protein', 'Meat, fish, eggs, dairy', 1),
('Carbohydrates', 'Grains, bread, pasta, rice', 2),
('Vegetables', 'Fresh and cooked vegetables', 3),
('Fruits', 'Fresh and dried fruits', 4),
('Fats & Oils', 'Oils, nuts, seeds, avocado', 5),
('Dairy', 'Milk, cheese, yogurt', 6),
('Beverages', 'Drinks and liquids', 7),
('Snacks', 'Snacks and treats', 8),
('Supplements', 'Protein powder, vitamins', 9),
('Other', 'Miscellaneous foods', 10)
ON CONFLICT DO NOTHING;

-- Add RLS policies
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_plan_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_adherence ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_ratings ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON foods TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON meal_templates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON nutrition_plan_details TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON client_meal_logs TO authenticated;
GRANT SELECT, UPDATE ON nutrition_adherence TO authenticated;
GRANT SELECT, INSERT, UPDATE ON food_ratings TO authenticated;
GRANT SELECT ON food_categories TO authenticated;

-- Comments
COMMENT ON TABLE foods IS 'Food database with USDA, custom, and AI-generated foods';
COMMENT ON TABLE meal_templates IS 'Reusable meal templates for quick plan creation';
COMMENT ON TABLE nutrition_plan_details IS 'Nutrition-specific plan data (macros, meal schedule)';
COMMENT ON TABLE client_meal_logs IS 'Client food logging for adherence tracking';
COMMENT ON TABLE nutrition_adherence IS 'Weekly adherence metrics and macro tracking';
COMMENT ON COLUMN nutrition_plan_details.protein_percent IS 'Percentage of calories from protein';
COMMENT ON COLUMN nutrition_plan_details.carbs_percent IS 'Percentage of calories from carbs';
COMMENT ON COLUMN nutrition_plan_details.fat_percent IS 'Percentage of calories from fat';
