const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test database connection by fetching some data
    console.log('Testing database connection...');
    
    // Test 1: Fetch customers
    const customers = await prisma.customers.findMany({
      take: 1,
      where: {
        tenant_id: BigInt(1)
      }
    });
    console.log('✓ Customers table accessible');
    
    // Test 2: Fetch team members
    const teamMembers = await prisma.team_members.findMany({
      take: 1,
      where: {
        tenant_id: BigInt(1)
      }
    });
    console.log('✓ Team members table accessible');
    
    // Test 3: Fetch workouts
    const workouts = await prisma.workouts.findMany({
      take: 1,
      where: {
        tenant_id: BigInt(1)
      }
    });
    console.log('✓ Workouts table accessible');
    
    // Test 4: Fetch nutrition plans
    const nutritionPlans = await prisma.nutrition_plans.findMany({
      take: 1,
      where: {
        tenant_id: BigInt(1)
      }
    });
    console.log('✓ Nutrition plans table accessible');
    
    console.log('\n✅ All database connections successful!');
    console.log('The admin functionality should now work with the real database.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();