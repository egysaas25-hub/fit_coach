import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/services/auth'
import { auditService } from '@/lib/services/audit'
import { handleAPIError, NotFoundError, ValidationError } from '@/lib/errors'
import { z } from 'zod'

// Validation schema for progress entry
const createProgressSchema = z.object({
  metric_type: z.enum(['weight', 'body_fat', 'muscle_mass', 'chest', 'waist', 'hips', 'arms', 'thighs']),
  value: z.number().positive(),
  unit: z.string().default('kg'),
  notes: z.string().optional(),
  recorded_at: z.string().datetime().optional(),
})

/**
 * GET /api/clients/[id]/progress - Fetch client progress data
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

    // Fetch progress tracking data
    const progressEntries = await prisma.progress_tracking.findMany({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        customer_id: clientId,
      },
      orderBy: {
        recorded_at: 'desc',
      },
      take: 100, // Last 100 entries
    })

    // Fetch InBody metrics if available
    const inbodyMetrics = await prisma.inbody_metrics.findMany({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        customer_id: clientId,
      },
      orderBy: {
        scan_date: 'desc',
      },
      take: 20, // Last 20 scans
    })

    // Group progress by metric type
    const groupedProgress: Record<string, any[]> = {}
    progressEntries.forEach((entry) => {
      if (!groupedProgress[entry.metric_type]) {
        groupedProgress[entry.metric_type] = []
      }
      groupedProgress[entry.metric_type].push({
        id: entry.id.toString(),
        value: entry.value,
        unit: entry.unit,
        notes: entry.notes,
        recorded_at: entry.recorded_at,
      })
    })

    // Transform InBody metrics
    const transformedInbody = inbodyMetrics.map((metric) => ({
      id: metric.id.toString(),
      scan_date: metric.scan_date,
      weight: metric.weight,
      body_fat_percent: metric.body_fat_percent,
      muscle_mass: metric.muscle_mass,
      bmr: metric.bmr,
      visceral_fat_level: metric.visceral_fat_level,
      body_water_percent: metric.body_water_percent,
    }))

    return NextResponse.json({
      progress: groupedProgress,
      inbody: transformedInbody,
      summary: {
        total_entries: progressEntries.length,
        latest_weight: groupedProgress.weight?.[0]?.value || null,
        latest_body_fat: groupedProgress.body_fat?.[0]?.value || null,
        latest_muscle_mass: groupedProgress.muscle_mass?.[0]?.value || null,
      },
    })
  } catch (error) {
    return handleAPIError(error)
  }
}

/**
 * POST /api/clients/[id]/progress - Log new progress entry
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
    const data = createProgressSchema.parse(body)

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

    // Create progress entry
    const progressEntry = await prisma.progress_tracking.create({
      data: {
        tenant_id: BigInt(session.user.tenant_id),
        customer_id: clientId,
        metric_type: data.metric_type,
        value: data.value,
        unit: data.unit,
        notes: data.notes,
        recorded_at: data.recorded_at ? new Date(data.recorded_at) : new Date(),
        recorded_by: BigInt(session.user.id),
      },
    })

    // Log to audit trail
    await auditService.logProgressTracked(
      session,
      clientId.toString(),
      {
        metric_type: data.metric_type,
        value: data.value,
        unit: data.unit,
      }
    )

    return NextResponse.json({
      id: progressEntry.id.toString(),
      metric_type: progressEntry.metric_type,
      value: progressEntry.value,
      unit: progressEntry.unit,
      notes: progressEntry.notes,
      recorded_at: progressEntry.recorded_at,
    }, { status: 201 })
  } catch (error) {
    return handleAPIError(error)
  }
}
