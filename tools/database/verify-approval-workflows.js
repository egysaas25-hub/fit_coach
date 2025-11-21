const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyApprovalWorkflows() {
  console.log('🔍 Verifying approval workflows...\n')

  try {
    // Get all approval workflows
    const workflows = await prisma.approval_workflows.findMany({
      include: {
        tenant: {
          select: { name: true },
        },
        submitted_by_team_member: {
          select: { full_name: true, email: true },
        },
        reviewed_by_team_member: {
          select: { full_name: true, email: true },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    console.log(`Found ${workflows.length} approval workflow(s):\n`)

    workflows.forEach((workflow, index) => {
      console.log(`${index + 1}. Approval Workflow #${workflow.id}`)
      console.log(`   Tenant: ${workflow.tenant.name}`)
      console.log(`   Entity Type: ${workflow.entity_type}`)
      console.log(`   Entity ID: ${workflow.entity_id}`)
      console.log(`   Status: ${workflow.status}`)
      console.log(`   Submitted By: ${workflow.submitted_by_team_member.full_name} (${workflow.submitted_by_team_member.email})`)
      
      if (workflow.reviewed_by_team_member) {
        console.log(`   Reviewed By: ${workflow.reviewed_by_team_member.full_name} (${workflow.reviewed_by_team_member.email})`)
        console.log(`   Reviewed At: ${workflow.reviewed_at}`)
      } else {
        console.log(`   Reviewed By: (pending)`)
      }
      
      console.log(`   Notes: ${workflow.notes}`)
      
      if (workflow.metadata) {
        console.log(`   Metadata: ${JSON.stringify(workflow.metadata, null, 2)}`)
      }
      
      console.log(`   Created At: ${workflow.created_at}`)
      console.log(`   Updated At: ${workflow.updated_at}`)
      console.log('')
    })

    // Summary statistics
    console.log('📊 Summary Statistics:')
    const stats = await prisma.approval_workflows.groupBy({
      by: ['status'],
      _count: true,
    })

    stats.forEach(stat => {
      console.log(`   ${stat.status}: ${stat._count}`)
    })

    console.log('\n✅ Verification complete!')

  } catch (error) {
    console.error('❌ Error verifying approval workflows:', error)
    throw error
  }
}

verifyApprovalWorkflows()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
