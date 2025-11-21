import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedApprovalWorkflows() {
  console.log('🌱 Seeding approval workflows test data...')

  try {
    // Get the first tenant
    const tenant = await prisma.tenants.findFirst()
    if (!tenant) {
      console.error('❌ No tenant found. Please seed tenants first.')
      return
    }

    // Get team members
    const teamMembers = await prisma.team_members.findMany({
      where: { tenant_id: tenant.id },
      take: 3,
    })

    if (teamMembers.length === 0) {
      console.error('❌ No team members found. Please seed team members first.')
      return
    }

    const submitter = teamMembers[0]
    const reviewer = teamMembers[1] || teamMembers[0]

    // Get some exercises for testing
    const exercises = await prisma.exercises.findMany({
      where: { tenant_id: tenant.id },
      take: 3,
    })

    // Get some nutrition plans for testing
    const nutritionPlans = await prisma.nutrition_plans.findMany({
      where: { tenant_id: tenant.id },
      take: 2,
    })

    // Get some training plans for testing
    const trainingPlans = await prisma.training_plans.findMany({
      where: { tenant_id: tenant.id },
      take: 2,
    })

    // Create pending approval workflows for exercises
    if (exercises.length > 0) {
      await prisma.approval_workflows.create({
        data: {
          tenant_id: tenant.id,
          entity_type: 'exercise',
          entity_id: exercises[0].id,
          status: 'pending',
          submitted_by: submitter.id,
          notes: 'AI-generated exercise needs review',
          metadata: {
            source: 'ai_generation',
            confidence_score: 0.85,
          },
        },
      })
      console.log('✅ Created pending exercise approval workflow')
    }

    // Create approved approval workflow for exercise
    if (exercises.length > 1) {
      await prisma.approval_workflows.create({
        data: {
          tenant_id: tenant.id,
          entity_type: 'exercise',
          entity_id: exercises[1].id,
          status: 'approved',
          submitted_by: submitter.id,
          reviewed_by: reviewer.id,
          reviewed_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          notes: 'Looks good, approved for use',
          metadata: {
            source: 'ai_generation',
            confidence_score: 0.92,
          },
        },
      })
      console.log('✅ Created approved exercise approval workflow')
    }

    // Create rejected approval workflow for exercise
    if (exercises.length > 2) {
      await prisma.approval_workflows.create({
        data: {
          tenant_id: tenant.id,
          entity_type: 'exercise',
          entity_id: exercises[2].id,
          status: 'rejected',
          submitted_by: submitter.id,
          reviewed_by: reviewer.id,
          reviewed_at: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          notes: 'Exercise description is incomplete and needs more detail',
          metadata: {
            source: 'ai_generation',
            confidence_score: 0.65,
            rejection_reason: 'incomplete_description',
          },
        },
      })
      console.log('✅ Created rejected exercise approval workflow')
    }

    // Create pending approval workflows for nutrition plans
    if (nutritionPlans.length > 0) {
      await prisma.approval_workflows.create({
        data: {
          tenant_id: tenant.id,
          entity_type: 'nutrition',
          entity_id: nutritionPlans[0].id,
          status: 'pending',
          submitted_by: submitter.id,
          notes: 'AI-generated nutrition plan awaiting review',
          metadata: {
            source: 'ai_generation',
            confidence_score: 0.88,
            calories_target: 2000,
          },
        },
      })
      console.log('✅ Created pending nutrition plan approval workflow')
    }

    // Create approved approval workflow for nutrition plan
    if (nutritionPlans.length > 1) {
      await prisma.approval_workflows.create({
        data: {
          tenant_id: tenant.id,
          entity_type: 'nutrition',
          entity_id: nutritionPlans[1].id,
          status: 'approved',
          submitted_by: submitter.id,
          reviewed_by: reviewer.id,
          reviewed_at: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
          notes: 'Nutrition plan is well-balanced and approved',
          metadata: {
            source: 'ai_generation',
            confidence_score: 0.94,
          },
        },
      })
      console.log('✅ Created approved nutrition plan approval workflow')
    }

    // Create pending approval workflows for training plans (workouts)
    if (trainingPlans.length > 0) {
      await prisma.approval_workflows.create({
        data: {
          tenant_id: tenant.id,
          entity_type: 'workout',
          entity_id: trainingPlans[0].id,
          status: 'pending',
          submitted_by: submitter.id,
          notes: 'AI-generated workout plan needs trainer review',
          metadata: {
            source: 'ai_generation',
            confidence_score: 0.79,
            difficulty: 'intermediate',
          },
        },
      })
      console.log('✅ Created pending workout approval workflow')
    }

    // Create approved approval workflow for training plan
    if (trainingPlans.length > 1) {
      await prisma.approval_workflows.create({
        data: {
          tenant_id: tenant.id,
          entity_type: 'workout',
          entity_id: trainingPlans[1].id,
          status: 'approved',
          submitted_by: submitter.id,
          reviewed_by: reviewer.id,
          reviewed_at: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
          notes: 'Workout progression looks appropriate',
          metadata: {
            source: 'ai_generation',
            confidence_score: 0.91,
          },
        },
      })
      console.log('✅ Created approved workout approval workflow')
    }

    // Get count of created workflows
    const count = await prisma.approval_workflows.count({
      where: { tenant_id: tenant.id },
    })

    console.log(`\n✅ Approval workflows seed complete! Created ${count} approval workflow records.`)
    console.log('\nBreakdown by status:')
    
    const pendingCount = await prisma.approval_workflows.count({
      where: { tenant_id: tenant.id, status: 'pending' },
    })
    const approvedCount = await prisma.approval_workflows.count({
      where: { tenant_id: tenant.id, status: 'approved' },
    })
    const rejectedCount = await prisma.approval_workflows.count({
      where: { tenant_id: tenant.id, status: 'rejected' },
    })

    console.log(`  - Pending: ${pendingCount}`)
    console.log(`  - Approved: ${approvedCount}`)
    console.log(`  - Rejected: ${rejectedCount}`)

  } catch (error) {
    console.error('❌ Error seeding approval workflows:', error)
    throw error
  }
}

seedApprovalWorkflows()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
