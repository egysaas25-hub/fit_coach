import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/services/auth'
import { handleAPIError } from '@/lib/errors'
import { subDays, format } from 'date-fns'

/**
 * GET /api/analytics/system - Fetch system health metrics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)
    const { searchParams } = new URL(request.url)
    
    const days = parseInt(searchParams.get('days') || '7')
    const startDate = subDays(new Date(), days)

    // API Latency (simulated - would come from monitoring service)
    const avgApiLatency = 245 // ms

    // System Uptime (simulated - would come from monitoring service)
    const systemUptime = 99.8 // percentage

    // WhatsApp Delivery Success Rate
    const deliveryStats = await prisma.$queryRaw<Array<{
      total_deliveries: number
      successful_deliveries: number
    }>>`
      SELECT 
        COUNT(*) as total_deliveries,
        COUNT(*) FILTER (WHERE status = 'delivered') as successful_deliveries
      FROM plan_assignments
      WHERE tenant_id = ${BigInt(session.user.tenant_id)}
        AND created_at >= ${startDate}
    `
    
    const deliverySuccessRate = deliveryStats[0]?.total_deliveries > 0
      ? (Number(deliveryStats[0].successful_deliveries) / Number(deliveryStats[0].total_deliveries)) * 100
      : 100

    // Storage Usage (simulated - would query actual storage)
    const storageUsageGB = 12.5

    // API Response Time Trend (simulated data)
    const apiLatencyTrend = Array.from({ length: days }, (_, i) => ({
      date: format(subDays(new Date(), days - i - 1), 'MMM d'),
      latency: Math.floor(200 + Math.random() * 100),
    }))

    // WhatsApp Delivery Trend
    const deliveryTrend = await prisma.$queryRaw<Array<{
      date: Date
      total: number
      successful: number
    }>>`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'delivered') as successful
      FROM plan_assignments
      WHERE tenant_id = ${BigInt(session.user.tenant_id)}
        AND created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    // Database Performance
    const dbStats = await prisma.$queryRaw<Array<{
      table_name: string
      row_count: number
    }>>`
      SELECT 
        schemaname || '.' || tablename as table_name,
        n_live_tup as row_count
      FROM pg_stat_user_tables
      WHERE schemaname = 'public'
      ORDER BY n_live_tup DESC
      LIMIT 10
    `

    // Active Sessions
    const activeSessions = await prisma.team_members.count({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        active: true,
      },
    })

    // Error Rate (simulated - would come from error tracking)
    const errorRate = 0.2 // percentage

    return NextResponse.json({
      kpis: {
        avg_api_latency_ms: avgApiLatency,
        system_uptime_percent: systemUptime,
        delivery_success_rate: Math.round(deliverySuccessRate * 100) / 100,
        storage_usage_gb: storageUsageGB,
        active_sessions: activeSessions,
        error_rate_percent: errorRate,
      },
      api_latency_trend: apiLatencyTrend,
      delivery_trend: deliveryTrend.map(day => ({
        date: format(new Date(day.date), 'MMM d'),
        total: Number(day.total),
        successful: Number(day.successful),
        success_rate: Number(day.total) > 0 
          ? Math.round((Number(day.successful) / Number(day.total)) * 100)
          : 100,
      })),
      database_stats: dbStats.map(stat => ({
        table: stat.table_name,
        rows: Number(stat.row_count),
      })),
      period: {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(new Date(), 'yyyy-MM-dd'),
        days,
      },
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
