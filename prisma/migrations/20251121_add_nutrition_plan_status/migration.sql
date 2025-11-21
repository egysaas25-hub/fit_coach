-- Add status field to nutrition_plans table
ALTER TABLE nutrition_plans ADD COLUMN status VARCHAR(50) DEFAULT 'approved';

-- Update existing records to have 'approved' status
UPDATE nutrition_plans SET status = 'approved' WHERE status IS NULL;

-- Create index for status queries
CREATE INDEX idx_nutrition_plans_status ON nutrition_plans(tenant_id, status);
