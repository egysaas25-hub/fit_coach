// Simple database test
const { prisma } = require('../lib/prisma.js');

async function runTests() {
  console.log('Starting database tests...\n');
  
  try {
    // Test 1: Connect to database
    console.log('Test 1: Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');
    
    // Test 2: Create a customer
    console.log('Test 2: Creating a customer...');
    const customer = await prisma.customers.create({
      data: {
        tenant_id: BigInt(1),
        phone_e164: '+12345678905',
        first_name: 'Test',
        last_name: 'Customer',
        source: 'sales',
        status: 'lead',
      }
    });
    console.log('✅ Customer creation successful');
    console.log(`   Customer ID: ${customer.id}\n`);
    
    // Test 3: Create a team member
    console.log('Test 3: Creating a team member...');
    const teamMember = await prisma.team_members.create({
      data: {
        tenant_id: BigInt(1),
        full_name: 'Test Trainer',
        email: 'trainer5@test.com',
        role: 'coach',
      }
    });
    console.log('✅ Team member creation successful');
    console.log(`   Team member ID: ${teamMember.id}\n`);
    
    // Test 4: Create a nutrition plan
    console.log('Test 4: Creating a nutrition plan...');
    const nutritionPlan = await prisma.nutrition_plans.create({
      data: {
        tenant_id: BigInt(1),
        customer_id: customer.id,
        version: 1,
        is_active: true,
        created_by: teamMember.id,
      }
    });
    console.log('✅ Nutrition plan creation successful');
    console.log(`   Nutrition plan ID: ${nutritionPlan.id}\n`);
    
    // Test 5: Create a training plan
    console.log('Test 5: Creating a training plan...');
    const trainingPlan = await prisma.training_plans.create({
      data: {
        tenant_id: BigInt(1),
        customer_id: customer.id,
        version: 1,
        is_active: true,
        created_by: teamMember.id,
      }
    });
    console.log('✅ Training plan creation successful');
    console.log(`   Training plan ID: ${trainingPlan.id}\n`);
    
    // Test 6: Create a subscription
    console.log('Test 6: Creating a subscription...');
    // First, we need a currency
    const currencies = await prisma.currencies.findMany();
    let currencyId;
    if (currencies.length > 0) {
      currencyId = currencies[0].id;
    } else {
      // Create a default currency if none exists
      const defaultCurrency = await prisma.currencies.create({
        data: {
          code: 'USD',
          name: 'US Dollar',
          fx_rate_to_usd: 1.0,
        }
      });
      currencyId = defaultCurrency.id;
    }
    
    const subscription = await prisma.subscriptions.create({
      data: {
        tenant_id: BigInt(1),
        customer_id: customer.id,
        plan_code: 'basic',
        price_cents: 10000,
        currency_id: currencyId,
        status: 'active',
        start_at: new Date(),
      }
    });
    console.log('✅ Subscription creation successful');
    console.log(`   Subscription ID: ${subscription.id}\n`);
    
    // Test 7: Fetch all customers
    console.log('Test 7: Fetching all customers...');
    const customers = await prisma.customers.findMany({
      where: {
        tenant_id: BigInt(1),
      }
    });
    console.log(`✅ Found ${customers.length} customer(s)\n`);
    
    // Test 8: Fetch all team members
    console.log('Test 8: Fetching all team members...');
    const teamMembers = await prisma.team_members.findMany({
      where: {
        tenant_id: BigInt(1),
      }
    });
    console.log(`✅ Found ${teamMembers.length} team member(s)\n`);
    
    // Test 9: Fetch all nutrition plans
    console.log('Test 9: Fetching all nutrition plans...');
    const nutritionPlans = await prisma.nutrition_plans.findMany({
      where: {
        tenant_id: BigInt(1),
      }
    });
    console.log(`✅ Found ${nutritionPlans.length} nutrition plan(s)\n`);
    
    // Test 10: Fetch all training plans
    console.log('Test 10: Fetching all training plans...');
    const trainingPlans = await prisma.training_plans.findMany({
      where: {
        tenant_id: BigInt(1),
      }
    });
    console.log(`✅ Found ${trainingPlans.length} training plan(s)\n`);
    
    // Test 11: Fetch all subscriptions
    console.log('Test 11: Fetching all subscriptions...');
    const subscriptions = await prisma.subscriptions.findMany({
      where: {
        tenant_id: BigInt(1),
      }
    });
    console.log(`✅ Found ${subscriptions.length} subscription(s)\n`);
    
    // Clean up test data
    console.log('Cleaning up test data...');
    await prisma.subscriptions.delete({ where: { id: subscription.id } });
    await prisma.training_plans.delete({ where: { id: trainingPlan.id } });
    await prisma.nutrition_plans.delete({ where: { id: nutritionPlan.id } });
    await prisma.team_members.delete({ where: { id: teamMember.id } });
    await prisma.customers.delete({ where: { id: customer.id } });
    console.log('✅ Test data cleanup complete\n');
    
    console.log('🎉 All database tests passed!');
    console.log('\nSummary:');
    console.log('- Database connection: ✅ Working');
    console.log('- Customer creation: ✅ Working');
    console.log('- Team member creation: ✅ Working');
    console.log('- Nutrition plan creation: ✅ Working');
    console.log('- Training plan creation: ✅ Working');
    console.log('- Subscription creation: ✅ Working');
    console.log('- Data retrieval: ✅ Working');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };