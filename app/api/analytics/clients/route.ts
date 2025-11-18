import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/services/auth'
import { handleAPIError } from '@/lib/errors'
import { startOfMonth, endOfMonth, subMonths, format, startOfDay } from 'date-fns'

/**
 * GET /api/analytics/clients - Fetch client analytics data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)
    const { searchParams } = new URL(request.url)
    
    const months = parseInt(searchParams.get('months') || '12')
    const startDate = subMonths(new Date(), months)

    // Get total clients
    const totalClients = await prisma.customers.count({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        deleted_at: null,
      },
    })

    // Get active clients
    const activeClients = await prisma.customers.count({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        deleted_at: null,
        status: { in: ['active', 'trial'] },
      },
    })

    // Get expired clients
    const expiredClients = await prisma.customers.count({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        deleted_at: null,
        status: 'expired',
      },
    })

    // Calculate active percentage
    const activePercentage = totalClients > 0 ? (activeClients / totalClients) * 100 : 0

    // Calculate churn rate (clients lost this month / clients at start of month)
    const startOfThisMonth = startOfMonth(new Date())
    const clientsAtStartOfMonth = await prisma.customers.count({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        deleted_at: null,
        created_at: { lt: startOfThisMonth },
      },
    })

    const clientsLostThisMonth = await prisma.customers.count({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        status: 'churned',
        updated_at: { gte: startOfThisMonth },
      },
    })

    const churnRate = clientsAtStartOfMonth > 0 
      ? (clientsLostThisMonth / clientsAtStartOfMonth) * 100 
      : 0

    // Calculate retention rate
    const retentionRate = 100 - churnRate

    // Get client growth over time
    const clientGrowth = await prisma.$queryRaw<Array<{
      month: Date
      new_clients: number
      churned_clients: number
      net_growth: number
    }>>`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) FILTER (WHERE status != 'churned') as new_clients,
        COUNT(*) FILTER (WHERE status = 'churned') as churned_clients,
        COUNT(*) FILTER (WHERE status != 'churned') - COUNT(*) FILTER (WHERE status = 'churned') as net_growth
      FROM customers
      WHERE tenant_id = ${BigInt(session.user.tenant_id)}
        AND created_at >= ${startDate}
        AND deleted_at IS NULL
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `

    // Get engagement data (simplified - based on last interaction)
    const engagementData = await prisma.$queryRaw<Array<{
      engagement_level: string
      client_count: number
    }>>`
      SELECT 
        CASE 
          WHEN MAX(i.created_at) >= NOW() - INTERVAL '7 days' THEN 'high'
          WHEN MAX(i.created_at) >= NOW() - INTERVAL '30 days' THEN 'medium'
          ELSE 'low'
        END as engagement_level,
        COUNT(DISTINCT c.id) as client_count
      FROM customers c
      LEFT JOIN interactions i ON i.customer_id = c.id
      WHERE c.tenant_id = ${BigInt(session.user.tenant_id)}
        AND c.deleted_at IS NULL
        AND c.status IN ('active', 'trial')
      GROUP BY engagement_level
    `

    const avgEngagementScore = engagementData.reduce((sum, level) => {
      const score = level.engagement_level === 'high' ? 100 : level.engagement_level === 'medium' ? 60 : 30
      return sum + (score * Number(level.client_count))
    }, 0) / activeClients || 0

    // Get clients by status for pie chart
    const clientsByStatus = await prisma.$queryRaw<Array<{
      status: string
      count: number
    }>>`
      SELECT 
        status,
        COUNT(*) as count
      FROM customers
      WHERE tenant_id = ${BigInt(session.user.tenant_id)}
        AND deleted_at IS NULL
      GROUP BY status
      ORDER BY count DESC
    `

    // Get clients by goal
    const clientsByGoal = await prisma.$queryRaw<Array<{
      goal: string
      count: number
    }>>`
      SELECT 
        goal,
        COUNT(*) as count
      FROM customers
      WHERE tenant_id = ${BigInt(session.user.tenant_id)}
        AND deleted_at IS NULL
        AND goal IS NOT NULL
      GROUP BY goal
      ORDER BY count DESC
      LIMIT 5
    `

    // Get predicted churn list (clients with low engagement and expiring soon)
    const predictedChurn = await prisma.$queryRaw<Array<{
      id: bigint
      client_code: string
      first_name: string
      last_name: string
      last_interaction: Date | null
      subscription_end: Date | null
      risk_score: number
    }>>`
      SELECT 
        c.id,
        c.client_code,
        c.first_name,
        c.last_name,
        MAX(i.created_at) as last_interaction,
        MAX(s.end_date) as subscription_end,
        CASE 
          WHEN MAX(i.created_at) < NOW() - INTERVAL '30 days' THEN 80
          WHEN MAX(i.created_at) < NOW() - INTERVAL '14 days' THEN 60
          WHEN MAX(i.created_at) < NOW() - INTERVAL '7 days' THEN 40
          ELSE 20
        END as risk_score
      FROM customers c
      LEFT JOIN interactions i ON i.customer_id = c.id
      LEFT JOIN subscriptions s ON s.customer_id = c.id AND s.status = 'active'
      WHERE c.tenant_id = ${BigInt(session.user.tenant_id)}
        AND c.deleted_at IS NULL
        AND c.status = 'active'
      GROUP BY c.id, c.client_code, c.first_name, c.last_name
      HAVING MAX(i.created_at) < NOW() - INTERVAL '7 days' OR MAX(i.created_at) IS NULL
      ORDER BY risk_score DESC
      LIMIT 10
    `

    // Format growth trend data
    const growthTrend = clientGrowth.map(month => ({
      month: format(new Date(month.month), 'MMM yyyy'),
      new_clients: Number(month.new_clients),
      churned_clients: Number(month.churned_clients),
      net_growth: Number(month.net_growth),
    }))

    return NextResponse.json({
      kpis: {
        total_clients: totalClients,
        active_clients: activeClients,
        active_percentage: Math.round(activePercentage * 100) / 100,
        churn_rate: Math.round(churnRate * 100) / 100,
        retention_rate: Math.round(retentionRate * 100) / 100,
        avg_engagement_score: Math.round(avgEngagementScore),
        expired_clients: expiredClients,
      },
      growth_trend: growthTrend,
      engagement_distribution: engagementData.map(level => ({
        level: level.engagement_level,
        count: Number(level.client_count),
        percentage: activeClients > 0 ? (Number(level.client_count) / activeClients) * 100 : 0,
      })),
      clients_by_status: clientsByStatus.map(status => ({
        status: status.status,
        count: Number(status.count),
        percentage: totalClients > 0 ? (Number(status.count) / totalClients) * 100 : 0,
      })),
      clients_by_goal: clientsByGoal.map(goal => ({
        goal: goal.goal,
        count: Number(goal.count),
      })),
      predicted_churn: predictedChurn.map(client => ({
        id: client.id.toString(),
        client_code: client.client_code,
        name: `${client.first_name} ${client.last_name}`,
        last_interaction: client.last_interaction,
        subscription_end: client.subscription_end,
        risk_score: Number(client.risk_score),
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
