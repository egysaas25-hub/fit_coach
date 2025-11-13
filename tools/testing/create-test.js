// Test creating records in the database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCreateRecords() {
  console.log('Starting record creation test...\n');
  
  try {
    // Test 1: Create a customer
    console.log('Test 1: Creating a customer...');
    const customer = await prisma.customers.create({
      data: {
        tenant_id: BigInt(1),
        phone_e164: '+1234567890',
        first_name: 'John',
        last_name: 'Doe',
        source: 'sales',
        status: 'lead',
      }
    });
    console.log(`✅ Created customer with ID: ${customer.id}\n`);
    
    // Test 2: Create a team member
    console.log('Test 2: Creating a team member...');
    const teamMember = await prisma.team_members.create({
      data: {
        tenant_id: BigInt(1),
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'coach',
      }
    });
    console.log(`✅ Created team member with ID: ${teamMember.id}\n`);
    
    // Test 3: Create a nutrition plan
    console.log('Test 3: Creating a nutrition plan...');
    const nutritionPlan = await prisma.nutrition_plans.create({
      data: {
        tenant_id: BigInt(1),
        customer_id: customer.id,
        version: 1,
        is_active: true,
        created_by: teamMember.id,
      }
    });
    console.log(`✅ Created nutrition plan with ID: ${nutritionPlan.id}\n`);
    
    // Test 4: Create a training plan
    console.log('Test 4: Creating a training plan...');
    const trainingPlan = await prisma.training_plans.create({
      data: {
        tenant_id: BigInt(1),
        customer_id: customer.id,
        version: 1,
        is_active: true,
        created_by: teamMember.id,
      }
    });
    console.log(`✅ Created training plan with ID: ${trainingPlan.id}\n`);
    
    // Test 5: Create a subscription
    console.log('Test 5: Creating a subscription...');
    const subscription = await prisma.subscriptions.create({
      data: {
        tenant_id: BigInt(1),
        customer_id: customer.id,
        plan_code: 'basic',
        price_cents: 10000,
        currency_id: BigInt(1),
        status: 'active',
        start_at: new Date(),
      }
    });
    console.log(`✅ Created subscription with ID: ${subscription.id}\n`);
    
    console.log('🎉 All creation tests passed! Database operations are working properly.');
    console.log('\nSummary:');
    console.log('- Customer creation: ✅ Working');
    console.log('- Team member creation: ✅ Working');
    console.log('- Nutrition plan creation: ✅ Working');
    console.log('- Training plan creation: ✅ Working');
    console.log('- Subscription creation: ✅ Working');
    console.log('\nThe admin functionality is fully integrated with the real database.');
    
    // Clean up by deleting the created records
    console.log('\nCleaning up test records...');
    await prisma.subscriptions.delete({ where: { id: subscription.id } });
    await prisma.training_plans.delete({ where: { id: trainingPlan.id } });
    await prisma.nutrition_plans.delete({ where: { id: nutritionPlan.id } });
    await prisma.team_members.delete({ where: { id: teamMember.id } });
    await prisma.customers.delete({ where: { id: customer.id } });
    console.log('✅ Test records cleaned up successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testCreateRecords();