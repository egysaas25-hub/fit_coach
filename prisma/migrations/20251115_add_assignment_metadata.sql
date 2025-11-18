-- Add metadata column to plan_assignments for storing PDF URLs and delivery info

ALTER TABLE plan_assignments ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create index for metadata queries
CREATE INDEX IF NOT EXISTS idx_assignments_metadata ON plan_assignments USING gin(metadata);

-- Add comment
COMMENT ON COLUMN plan_assignments.metadata IS 'Stores PDF URL, delivery timestamps, and other assignment-specific data';
