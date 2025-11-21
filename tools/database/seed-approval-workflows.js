const { PrismaClient } = require('@prisma/client')

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

    console.log(`✅ Using tenant: ${tenant.name} (ID: ${tenant.id})`)

    // Get team members
    const teamMembers = await prisma.team_members.findMany({
      where: { tenant_id: tenant.id },
      take: 3,
    })

    if (teamMembers.length === 0) {
      console.error('❌ No team members found. Creating a default team member...')
      
      // Create a default team member for testing
      const defaultMember = await prisma.team_members.create({
        data: {
          tenant_id: tenant.id,
          full_name: 'Test Coach',
          email: 'coach@test.com',
          role: 'coach',
          active: true,
        },
      })
      teamMembers.push(defaultMember)
      console.log('✅ Created default team member')
    }

    const submitter = teamMembers[0]
    const reviewer = teamMembers[1] || teamMembers[0]

    console.log(`✅ Using submitter: ${submitter.full_name}`)
    console.log(`✅ Using reviewer: ${reviewer.full_name}`)

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

    console.log(`\nFound existing data:`)
    console.log(`  - Exercises: ${exercises.length}`)
    console.log(`  - Nutrition Plans: ${nutritionPlans.length}`)
    console.log(`  - Training Plans: ${trainingPlans.length}`)

    let createdCount = 0

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
      createdCount++
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
      createdCount++
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
      createdCount++
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
      createdCount++
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
      createdCount++
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
      createdCount++
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
      createdCount++
      console.log('✅ Created approved workout approval workflow')
    }

    // If no existing data, create some sample approval workflows with dummy entity IDs
    if (createdCount === 0) {
      console.log('\n⚠️  No existing exercises, nutrition plans, or training plans found.')
      console.log('Creating sample approval workflows with placeholder entity IDs...')

      // Create sample pending approval
      await prisma.approval_workflows.create({
        data: {
          tenant_id: tenant.id,
          entity_type: 'exercise',
          entity_id: 999999, // Placeholder ID
          status: 'pending',
          submitted_by: submitter.id,
          notes: 'Sample AI-generated exercise awaiting review',
          metadata: {
            source: 'ai_generation',
            confidence_score: 0.85,
            sample: true,
          },
        },
      })
      createdCount++

      // Create sample approved approval
      await prisma.approval_workflows.create({
        data: {
          tenant_id: tenant.id,
          entity_type: 'nutrition',
          entity_id: 999998, // Placeholder ID
          status: 'approved',
          submitted_by: submitter.id,
          reviewed_by: reviewer.id,
          reviewed_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
          notes: 'Sample approved nutrition plan',
          metadata: {
            source: 'ai_generation',
            confidence_score: 0.92,
            sample: true,
          },
        },
      })
      createdCount++

      // Create sample rejected approval
      await prisma.approval_workflows.create({
        data: {
          tenant_id: tenant.id,
          entity_type: 'workout',
          entity_id: 999997, // Placeholder ID
          status: 'rejected',
          submitted_by: submitter.id,
          reviewed_by: reviewer.id,
          reviewed_at: new Date(Date.now() - 12 * 60 * 60 * 1000),
          notes: 'Sample rejected workout - needs improvement',
          metadata: {
            source: 'ai_generation',
            confidence_score: 0.65,
            rejection_reason: 'needs_improvement',
            sample: true,
          },
        },
      })
      createdCount++

      console.log('✅ Created 3 sample approval workflows')
    }

    // Get count of created workflows
    const totalCount = await prisma.approval_workflows.count({
      where: { tenant_id: tenant.id },
    })

    console.log(`\n✅ Approval workflows seed complete! Total records: ${totalCount}`)
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
