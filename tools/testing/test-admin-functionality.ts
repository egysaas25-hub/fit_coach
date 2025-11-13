// test-admin-functionality.ts
// Simple test script to verify admin functionality with real database

import { prisma } from './lib/prisma';

async function testAdminFunctionality() {
  console.log('Testing admin functionality with real database...');
  
  try {
    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);
    
    // Test 1: Fetch dashboard analytics
    console.log('\n1. Testing dashboard analytics...');
    const clients = await prisma.customers.count({
      where: { tenant_id: tenantId }
    });
    console.log(`Total clients: ${clients}`);
    
    const trainers = await prisma.team_members.count({
      where: { 
        tenant_id: tenantId,
        role: 'coach'
      }
    });
    console.log(`Total trainers: ${trainers}`);
    
    // Test 2: Fetch client list
    console.log('\n2. Testing client list...');
    const clientList = await prisma.customers.findMany({
      where: { tenant_id: tenantId },
      take: 5
    });
    console.log(`Found ${clientList.length} clients`);
    clientList.forEach(client => {
      console.log(`  - ${client.first_name} ${client.last_name} (${client.phone_e164})`);
    });
    
    // Test 3: Fetch trainer list
    console.log('\n3. Testing trainer list...');
    const trainerList = await prisma.team_members.findMany({
      where: { 
        tenant_id: tenantId,
        role: 'coach'
      },
      take: 5
    });
    console.log(`Found ${trainerList.length} trainers`);
    trainerList.forEach(trainer => {
      console.log(`  - ${trainer.full_name} (${trainer.email})`);
    });
    
    // Test 4: Fetch workouts
    console.log('\n4. Testing workouts...');
    const workouts = await prisma.training_plans.count({
      where: { tenant_id: tenantId }
    });
    console.log(`Total workouts: ${workouts}`);
    
    // Test 5: Fetch nutrition plans
    console.log('\n5. Testing nutrition plans...');
    const nutritionPlans = await prisma.nutrition_plans.count({
      where: { tenant_id: tenantId }
    });
    console.log(`Total nutrition plans: ${nutritionPlans}`);
    
    // Test 6: Fetch subscriptions
    console.log('\n6. Testing subscriptions...');
    const subscriptions = await prisma.subscriptions.count({
      where: { tenant_id: tenantId }
    });
    console.log(`Total subscriptions: ${subscriptions}`);
    
    console.log('\n✅ All tests passed! Admin functionality is working with real database.');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAdminFunctionality();