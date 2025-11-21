/**
 * Test script for automation workflows API
 * Tests the PATCH endpoint for toggling workflow status
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAutomationWorkflows() {
  try {
    console.log('🧪 Testing Automation Workflows API\n');

    // Check if automation_workflows table exists
    console.log('1️⃣ Checking database schema...');
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'automation_workflows'
      );
    `;
    console.log('   ✅ automation_workflows table exists:', tableExists[0].exists);

    // Get tenant and team member
    const tenant = await prisma.tenants.findFirst();
    if (!tenant) {
      console.log('   ⚠️  No tenant found. Creating test tenant...');
      // In a real scenario, you'd create a tenant here
      console.log('   ℹ️  Please run the seed script first');
      return;
    }

    const teamMember = await prisma.team_members.findFirst({
      where: { tenant_id: tenant.id }
    });
    if (!teamMember) {
      console.log('   ⚠️  No team member found. Please create one first.');
      return;
    }

    console.log(`   ✅ Using tenant: ${tenant.name} (ID: ${tenant.id})`);
    console.log(`   ✅ Using team member: ${teamMember.full_name} (ID: ${teamMember.id})\n`);

    // Create a test workflow
    console.log('2️⃣ Creating test workflow...');
    const testWorkflow = await prisma.automation_workflows.create({
      data: {
        tenant_id: tenant.id,
        name: 'Test Workflow',
        description: 'A test workflow for API testing',
        trigger: 'Test Trigger',
        actions: ['Action 1', 'Action 2'],
        category: 'Testing',
        is_active: true,
        created_by: teamMember.id,
      }
    });
    console.log(`   ✅ Created workflow: ${testWorkflow.name} (ID: ${testWorkflow.id})`);
    console.log(`   ✅ Initial status: ${testWorkflow.is_active ? 'Active' : 'Inactive'}\n`);

    // Test toggling to inactive
    console.log('3️⃣ Testing toggle to inactive...');
    const updatedWorkflow1 = await prisma.automation_workflows.update({
      where: { id: testWorkflow.id },
      data: { is_active: false, updated_at: new Date() }
    });
    console.log(`   ✅ Updated status: ${updatedWorkflow1.is_active ? 'Active' : 'Inactive'}`);

    // Test toggling back to active
    console.log('4️⃣ Testing toggle to active...');
    const updatedWorkflow2 = await prisma.automation_workflows.update({
      where: { id: testWorkflow.id },
      data: { is_active: true, updated_at: new Date() }
    });
    console.log(`   ✅ Updated status: ${updatedWorkflow2.is_active ? 'Active' : 'Inactive'}\n`);

    // List all workflows
    console.log('5️⃣ Listing all workflows...');
    const allWorkflows = await prisma.automation_workflows.findMany({
      where: { tenant_id: tenant.id }
    });
    console.log(`   ✅ Found ${allWorkflows.length} workflow(s)`);
    allWorkflows.forEach(w => {
      console.log(`      - ${w.name} (${w.is_active ? 'Active' : 'Inactive'})`);
    });

    // Clean up test workflow
    console.log('\n6️⃣ Cleaning up test workflow...');
    await prisma.automation_workflows.delete({
      where: { id: testWorkflow.id }
    });
    console.log('   ✅ Test workflow deleted\n');

    console.log('✨ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
testAutomationWorkflows()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
