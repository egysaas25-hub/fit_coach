const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addNutritionStatus() {
  try {
    console.log('Adding status field to nutrition_plans table...');
    
    // Add status column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE nutrition_plans 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'approved'
    `);
    
    console.log('✓ Status column added');
    
    // Update existing records
    await prisma.$executeRawUnsafe(`
      UPDATE nutrition_plans 
      SET status = 'approved' 
      WHERE status IS NULL
    `);
    
    console.log('✓ Existing records updated');
    
    // Create index
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_nutrition_plans_status 
      ON nutrition_plans(tenant_id, status)
    `);
    
    console.log('✓ Index created');
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addNutritionStatus();
