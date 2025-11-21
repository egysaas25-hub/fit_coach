/**
 * Seed script for automation workflows
 * Creates sample automation workflows for testing
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleWorkflows = [
  {
    name: "Welcome New Client",
    description: "Automatically send welcome message and onboarding materials when a new client signs up",
    trigger: "Client Registration",
    actions: ["Send WhatsApp welcome", "Email onboarding guide", "Schedule first session"],
    category: "Onboarding",
    is_active: true,
    executions: 156,
    success_rate: 98,
    last_run_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    name: "Plan Delivery Notification",
    description: "Notify client when their training and nutrition plans are ready for delivery",
    trigger: "Plan Assignment",
    actions: ["Generate PDF", "Send WhatsApp notification", "Create check-in schedule"],
    category: "Plan Management",
    is_active: true,
    executions: 89,
    success_rate: 95,
    last_run_at: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    name: "Missed Check-in Follow-up",
    description: "Send reminder messages when clients miss their scheduled check-ins",
    trigger: "Missed Check-in",
    actions: ["Send reminder WhatsApp", "Notify trainer", "Reschedule check-in"],
    category: "Engagement",
    is_active: true,
    executions: 234,
    success_rate: 87,
    last_run_at: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  },
  {
    name: "Progress Milestone Celebration",
    description: "Automatically celebrate when clients reach their fitness milestones",
    trigger: "Milestone Achieved",
    actions: ["Send congratulations message", "Update progress badge", "Share achievement"],
    category: "Motivation",
    is_active: true,
    executions: 67,
    success_rate: 100,
    last_run_at: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    name: "Subscription Renewal Reminder",
    description: "Remind clients about upcoming subscription renewals and payment due dates",
    trigger: "7 Days Before Expiry",
    actions: ["Send renewal reminder", "Generate invoice", "Offer renewal discount"],
    category: "Billing",
    is_active: false,
    executions: 45,
    success_rate: 92,
    last_run_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    name: "Trainer Workload Alert",
    description: "Alert administrators when trainer workload exceeds capacity limits",
    trigger: "Workload > 90%",
    actions: ["Send admin alert", "Suggest client redistribution", "Block new assignments"],
    category: "Team Management",
    is_active: true,
    executions: 12,
    success_rate: 100,
    last_run_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
];

async function seedAutomationWorkflows() {
  try {
    console.log('🌱 Seeding automation workflows...');

    // Get the first tenant
    const tenant = await prisma.tenants.findFirst();
    if (!tenant) {
      console.error('❌ No tenant found. Please create a tenant first.');
      return;
    }

    // Get the first team member
    const teamMember = await prisma.team_members.findFirst({
      where: { tenant_id: tenant.id }
    });
    if (!teamMember) {
      console.error('❌ No team member found. Please create a team member first.');
      return;
    }

    console.log(`📍 Using tenant: ${tenant.name} (ID: ${tenant.id})`);
    console.log(`👤 Using team member: ${teamMember.full_name} (ID: ${teamMember.id})`);

    // Delete existing workflows for this tenant
    const deleted = await prisma.automation_workflows.deleteMany({
      where: { tenant_id: tenant.id }
    });
    console.log(`🗑️  Deleted ${deleted.count} existing workflows`);

    // Create new workflows
    for (const workflow of sampleWorkflows) {
      const created = await prisma.automation_workflows.create({
        data: {
          ...workflow,
          tenant_id: tenant.id,
          created_by: teamMember.id,
        }
      });
      console.log(`✅ Created workflow: ${created.name} (ID: ${created.id})`);
    }

    console.log('✨ Automation workflows seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding automation workflows:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedAutomationWorkflows()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
