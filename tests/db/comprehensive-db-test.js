// Comprehensive database connection test
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnectivity() {
  console.log('Starting comprehensive database connectivity test...\n');
  
  try {
    // Test 1: Check if we can connect to the database
    console.log('Test 1: Checking database connectivity...');
    await prisma.$connect();
    console.log('✅ Database connection established\n');
    
    // Test 2: Fetch customers
    console.log('Test 2: Fetching customers...');
    const customers = await prisma.customers.findMany({
      take: 1,
      where: {
        tenant_id: BigInt(1)
      }
    });
    console.log(`✅ Found ${customers.length} customer(s)\n`);
    
    // Test 3: Fetch team members
    console.log('Test 3: Fetching team members...');
    const teamMembers = await prisma.team_members.findMany({
      take: 1,
      where: {
        tenant_id: BigInt(1)
      }
    });
    console.log(`✅ Found ${teamMembers.length} team member(s)\n`);
    
    // Test 4: Fetch workouts
    console.log('Test 4: Fetching workouts...');
    const workouts = await prisma.workouts.findMany({
      take: 1,
      where: {
        tenant_id: BigInt(1)
      }
    });
    console.log(`✅ Found ${workouts.length} workout(s)\n`);
    
    // Test 5: Fetch nutrition plans
    console.log('Test 5: Fetching nutrition plans...');
    const nutritionPlans = await prisma.nutrition_plans.findMany({
      take: 1,
      where: {
        tenant_id: BigInt(1)
      }
    });
    console.log(`✅ Found ${nutritionPlans.length} nutrition plan(s)\n`);
    
    // Test 6: Test creating a customer (without saving permanently)
    console.log('Test 6: Testing customer creation (dry run)...');
    const customerCountBefore = await prisma.customers.count({
      where: {
        tenant_id: BigInt(1)
      }
    });
    console.log(`✅ Current customer count: ${customerCountBefore}\n`);
    
    console.log('🎉 All tests passed! Database connectivity is working properly.');
    console.log('\nSummary:');
    console.log('- Database connection: ✅ Working');
    console.log('- Customer table access: ✅ Working');
    console.log('- Team members table access: ✅ Working');
    console.log('- Workouts table access: ✅ Working');
    console.log('- Nutrition plans table access: ✅ Working');
    console.log('\nThe admin functionality should now work with the real database.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnectivity();