import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/services/auth'
import { handleAPIError } from '@/lib/errors'
import { subMonths, format } from 'date-fns'

/**
 * GET /api/analytics/trainers - Fetch trainer analytics data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)
    const { searchParams } = new URL(request.url)
    
    const months = parseInt(searchParams.get('months') || '3')
    const startDate = subMonths(new Date(), months)

    // Get all trainers
    const trainers = await prisma.team_members.findMany({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        role: { in: ['superior_trainer', 'senior_trainer', 'junior_trainer'] },
        active: true,
      },
      select: {
        id: true,
        full_name: true,
        role: true,
        max_caseload: true,
      },
    })

    // Calculate metrics for each trainer
    const trainerMetrics = await Promise.all(
      trainers.map(async (trainer) => {
        // Assigned clients
        const assignedClients = await prisma.customers.count({
          where: {
            tenant_id: BigInt(session.user.tenant_id),
            assigned_trainer_id: trainer.id,
            deleted_at: null,
            status: { in: ['active', 'trial'] },
          },
        })

        // Workload index
        const workloadIndex = trainer.max_caseload && trainer.max_caseload > 0
          ? Math.round((assignedClients / trainer.max_caseload) * 100)
          : 0

        // Average response time (last 30 days)
        const responseTimeData = await prisma.$queryRaw<Array<{ avg_response_time: number }>>`
          SELECT AVG(EXTRACT(EPOCH FROM (responded_at - created_at))) as avg_response_time
          FROM interactions
          WHERE tenant_id = ${BigInt(session.user.tenant_id)}
            AND responder_id = ${trainer.id}
            AND responded_at IS NOT NULL
            AND created_at >= NOW() - INTERVAL '30 days'
        `
        const avgResponseTime = responseTimeData[0]?.avg_response_time || 0

        // SLA compliance (<5 min response for 90% of messages)
        const slaData = await prisma.$queryRaw<Array<{ 
          total_messages: number
          within_sla: number 
        }>>`
          SELECT 
            COUNT(*) as total_messages,
            COUNT(*) FILTER (
              WHERE EXTRACT(EPOCH FROM (responded_at - created_at)) <= 300
            ) as within_sla
          FROM interactions
          WHERE tenant_id = ${BigInt(session.user.tenant_id)}
            AND responder_id = ${trainer.id}
            AND responded_at IS NOT NULL
            AND created_at >= NOW() - INTERVAL '30 days'
        `
        const slaCompliance = slaData[0]?.total_messages > 0
          ? (Number(slaData[0].within_sla) / Number(slaData[0].total_messages)) * 100
          : 0

        // Client satisfaction (simplified - based on retention)
        const retainedClients = await prisma.customers.count({
          where: {
            tenant_id: BigInt(session.user.tenant_id),
            assigned_trainer_id: trainer.id,
            status: 'active',
            created_at: { lt: subMonths(new Date(), 3) },
          },
        })
        const totalOldClients = await prisma.customers.count({
          where: {
            tenant_id: BigInt(session.user.tenant_id),
            assigned_trainer_id: trainer.id,
            created_at: { lt: subMonths(new Date(), 3) },
          },
        })
        const satisfactionScore = totalOldClients > 0
          ? Math.round((retainedClients / totalOldClients) * 100)
          : 100

        return {
          id: trainer.id.toString(),
          name: trainer.full_name,
          role: trainer.role,
          assigned_clients: assignedClients,
          max_caseload: trainer.max_caseload,
          workload_index: workloadIndex,
          avg_response_time_seconds: Math.round(avgResponseTime),
          sla_compliance: Math.round(slaCompliance),
          satisfaction_score: satisfactionScore,
        }
      })
    )

    // Calculate overall metrics
    const totalTrainers = trainers.length
    const avgResponseTime = trainerMetrics.reduce((sum, t) => sum + t.avg_response_time_seconds, 0) / totalTrainers || 0
    const avgWorkload = trainerMetrics.reduce((sum, t) => sum + t.workload_index, 0) / totalTrainers || 0
    const avgSLA = trainerMetrics.reduce((sum, t) => sum + t.sla_compliance, 0) / totalTrainers || 0

    // Workload distribution
    const workloadDistribution = trainerMetrics.map(t => ({
      name: t.name,
      workload: t.workload_index,
      clients: t.assigned_clients,
    }))

    // Response time trend (last 3 months)
    const responseTimeTrend = await prisma.$queryRaw<Array<{
      month: Date
      avg_response_time: number
    }>>`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        AVG(EXTRACT(EPOCH FROM (responded_at - created_at))) as avg_response_time
      FROM interactions
      WHERE tenant_id = ${BigInt(session.user.tenant_id)}
        AND responded_at IS NOT NULL
        AND created_at >= ${startDate}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `

    return NextResponse.json({
      kpis: {
        total_trainers: totalTrainers,
        avg_response_time_seconds: Math.round(avgResponseTime),
        avg_workload_index: Math.round(avgWorkload),
        avg_sla_compliance: Math.round(avgSLA),
      },
      trainer_metrics: trainerMetrics,
      workload_distribution: workloadDistribution,
      response_time_trend: responseTimeTrend.map(month => ({
        month: format(new Date(month.month), 'MMM yyyy'),
        avg_response_time: Math.round(Number(month.avg_response_time)),
      })),
      period: {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(new Date(), 'yyyy-MM-dd'),
        months,
      },
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
