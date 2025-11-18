import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/services/auth'
import { auditService } from '@/lib/services/audit'
import { handleAPIError, NotFoundError } from '@/lib/errors'
import { z } from 'zod'

// Validation schema for milestone
const createMilestoneSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  metric_type: z.enum(['weight', 'body_fat', 'muscle_mass', 'workout_count', 'adherence', 'custom']),
  target_value: z.number().positive(),
  target_unit: z.string().default('kg'),
  target_date: z.string().datetime().optional(),
  reward_message: z.string().optional(),
})

const updateMilestoneSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  target_value: z.number().positive().optional(),
  target_date: z.string().datetime().optional(),
  status: z.enum(['active', 'achieved', 'cancelled']).optional(),
  achieved_at: z.string().datetime().optional(),
  achieved_value: z.number().optional(),
})

/**
 * GET /api/clients/[id]/milestones - Fetch client milestones
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    const clientId = BigInt(params.id)

    // Verify client exists and belongs to tenant
    const client = await prisma.customers.findFirst({
      where: {
        id: clientId,
        tenant_id: BigInt(session.user.tenant_id),
        deleted_at: null,
      },
    })

    if (!client) {
      throw new NotFoundError('Client not found')
    }

    // Fetch milestones
    const milestones = await prisma.milestones.findMany({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        customer_id: clientId,
      },
      orderBy: [
        { status: 'asc' }, // Active first
        { target_date: 'asc' },
      ],
    })

    // Calculate progress for each milestone
    const milestonesWithProgress = await Promise.all(
      milestones.map(async (milestone) => {
        let currentValue = null
        let progressPercent = 0

        if (milestone.metric_type !== 'custom') {
          // Get latest value for this metric
          const latestProgress = await prisma.progress_tracking.findFirst({
            where: {
              tenant_id: BigInt(session.user.tenant_id),
              customer_id: clientId,
              metric_type: milestone.metric_type,
            },
            orderBy: { recorded_at: 'desc' },
          })

          if (latestProgress) {
            currentValue = latestProgress.value
            
            // Calculate progress percentage
            // For weight/body_fat, lower is better
            if (milestone.metric_type === 'weight' || milestone.metric_type === 'body_fat') {
              const startValue = milestone.start_value || currentValue
              const progress = startValue - currentValue
              const target = startValue - milestone.target_value
              progressPercent = target > 0 ? Math.min(100, (progress / target) * 100) : 0
            } else {
              // For muscle_mass, higher is better
              const startValue = milestone.start_value || 0
              const progress = currentValue - startValue
              const target = milestone.target_value - startValue
              progressPercent = target > 0 ? Math.min(100, (progress / target) * 100) : 0
            }
          }
        }

        return {
          id: milestone.id.toString(),
          title: milestone.title,
          description: milestone.description,
          metric_type: milestone.metric_type,
          target_value: milestone.target_value,
          target_unit: milestone.target_unit,
          target_date: milestone.target_date,
          status: milestone.status,
          current_value: currentValue,
          progress_percent: Math.round(progressPercent),
          achieved_at: milestone.achieved_at,
          achieved_value: milestone.achieved_value,
          reward_message: milestone.reward_message,
          created_at: milestone.created_at,
        }
      })
    )

    return NextResponse.json({
      milestones: milestonesWithProgress,
      summary: {
        total: milestones.length,
        active: milestones.filter(m => m.status === 'active').length,
        achieved: milestones.filter(m => m.status === 'achieved').length,
      },
    })
  } catch (error) {
    return handleAPIError(error)
  }
}

/**
 * POST /api/clients/[id]/milestones - Create new milestone
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    const clientId = BigInt(params.id)
    const body = await request.json()

    // Validate input
    const data = createMilestoneSchema.parse(body)

    // Verify client exists
    const client = await prisma.customers.findFirst({
      where: {
        id: clientId,
        tenant_id: BigInt(session.user.tenant_id),
        deleted_at: null,
      },
    })

    if (!client) {
      throw new NotFoundError('Client not found')
    }

    // Get current value as start value
    let startValue = null
    if (data.metric_type !== 'custom') {
      const latestProgress = await prisma.progress_tracking.findFirst({
        where: {
          tenant_id: BigInt(session.user.tenant_id),
          customer_id: clientId,
          metric_type: data.metric_type,
        },
        orderBy: { recorded_at: 'desc' },
      })
      startValue = latestProgress?.value || null
    }

    // Create milestone
    const milestone = await prisma.milestones.create({
      data: {
        tenant_id: BigInt(session.user.tenant_id),
        customer_id: clientId,
        title: data.title,
        description: data.description,
        metric_type: data.metric_type,
        target_value: data.target_value,
        target_unit: data.target_unit,
        target_date: data.target_date ? new Date(data.target_date) : null,
        start_value: startValue,
        status: 'active',
        reward_message: data.reward_message,
        created_by: BigInt(session.user.id),
      },
    })

    // Log to audit trail
    await auditService.logAction(session, {
      entity: 'milestone',
      action: 'created',
      entityId: milestone.id.toString(),
      changes: {
        title: data.title,
        metric_type: data.metric_type,
        target_value: data.target_value,
      },
    })

    return NextResponse.json({
      id: milestone.id.toString(),
      title: milestone.title,
      description: milestone.description,
      metric_type: milestone.metric_type,
      target_value: milestone.target_value,
      target_unit: milestone.target_unit,
      status: milestone.status,
      created_at: milestone.created_at,
    }, { status: 201 })
  } catch (error) {
    return handleAPIError(error)
  }
}

/**
 * PATCH /api/clients/[id]/milestones - Update milestone
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    const clientId = BigInt(params.id)
    const body = await request.json()
    const { milestone_id, ...updateData } = body

    if (!milestone_id) {
      throw new Error('milestone_id is required')
    }

    // Validate input
    const data = updateMilestoneSchema.parse(updateData)

    // Verify milestone exists and belongs to client
    const existingMilestone = await prisma.milestones.findFirst({
      where: {
        id: BigInt(milestone_id),
        customer_id: clientId,
        tenant_id: BigInt(session.user.tenant_id),
      },
    })

    if (!existingMilestone) {
      throw new NotFoundError('Milestone not found')
    }

    // Update milestone
    const milestone = await prisma.milestones.update({
      where: { id: BigInt(milestone_id) },
      data: {
        ...data,
        target_date: data.target_date ? new Date(data.target_date) : undefined,
        achieved_at: data.achieved_at ? new Date(data.achieved_at) : undefined,
      },
    })

    // If milestone was just achieved, send recognition message
    if (data.status === 'achieved' && existingMilestone.status !== 'achieved') {
      await auditService.logMilestoneAchieved(session, clientId.toString(), {
        milestone_id: milestone.id.toString(),
        title: milestone.title,
        achieved_value: data.achieved_value,
      })

      // TODO: Send WhatsApp recognition message
      // await whatsappService.sendMilestoneAchievement({
      //   clientId: clientId.toString(),
      //   milestone: milestone.title,
      //   message: milestone.reward_message,
      // })
    }

    return NextResponse.json({
      id: milestone.id.toString(),
      title: milestone.title,
      status: milestone.status,
      achieved_at: milestone.achieved_at,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
