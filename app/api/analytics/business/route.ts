import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/services/auth'
import { handleAPIError } from '@/lib/errors'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

/**
 * GET /api/analytics/business - Fetch business analytics data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)
    const { searchParams } = new URL(request.url)
    
    const months = parseInt(searchParams.get('months') || '12')
    const startDate = subMonths(new Date(), months)

    // Calculate MRR (Monthly Recurring Revenue)
    const activeSubscriptions = await prisma.subscriptions.findMany({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        status: 'active',
      },
      select: {
        price_cents: true,
        billing_cycle: true,
      },
    })

    const mrr = activeSubscriptions.reduce((sum, sub) => {
      const monthlyPrice = sub.billing_cycle === 'monthly' 
        ? sub.price_cents 
        : sub.billing_cycle === 'quarterly'
        ? sub.price_cents / 3
        : sub.billing_cycle === 'yearly'
        ? sub.price_cents / 12
        : 0
      return sum + monthlyPrice
    }, 0) / 100 // Convert cents to dollars

    // Get revenue data for last N months
    const revenueByMonth = await prisma.$queryRaw<Array<{
      month: Date
      total_revenue: number
      transaction_count: number
    }>>`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(amount_cents) / 100.0 as total_revenue,
        COUNT(*) as transaction_count
      FROM payments
      WHERE tenant_id = ${BigInt(session.user.tenant_id)}
        AND status = 'completed'
        AND created_at >= ${startDate}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `

    // Calculate total revenue
    const totalRevenue = revenueByMonth.reduce((sum, month) => sum + Number(month.total_revenue), 0)

    // Get payment gateway distribution
    const gatewayDistribution = await prisma.$queryRaw<Array<{
      gateway: string
      total_amount: number
      transaction_count: number
    }>>`
      SELECT 
        payment_gateway as gateway,
        SUM(amount_cents) / 100.0 as total_amount,
        COUNT(*) as transaction_count
      FROM payments
      WHERE tenant_id = ${BigInt(session.user.tenant_id)}
        AND status = 'completed'
        AND created_at >= ${startDate}
      GROUP BY payment_gateway
      ORDER BY total_amount DESC
    `

    // Get expenses (simplified - from a hypothetical expenses table)
    // For now, we'll calculate as a percentage of revenue
    const estimatedExpenses = totalRevenue * 0.3 // 30% expense ratio

    // Calculate profit margin
    const profit = totalRevenue - estimatedExpenses
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0

    // Calculate average transaction value
    const totalTransactions = revenueByMonth.reduce((sum, month) => sum + Number(month.transaction_count), 0)
    const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

    // Get new vs returning customer revenue
    const customerRevenue = await prisma.$queryRaw<Array<{
      is_new_customer: boolean
      total_revenue: number
    }>>`
      SELECT 
        CASE 
          WHEN COUNT(*) OVER (PARTITION BY customer_id ORDER BY created_at) = 1 
          THEN true 
          ELSE false 
        END as is_new_customer,
        SUM(amount_cents) / 100.0 as total_revenue
      FROM payments
      WHERE tenant_id = ${BigInt(session.user.tenant_id)}
        AND status = 'completed'
        AND created_at >= ${startDate}
      GROUP BY customer_id, created_at
    `

    const newCustomerRevenue = customerRevenue
      .filter(c => c.is_new_customer)
      .reduce((sum, c) => sum + Number(c.total_revenue), 0)
    
    const returningCustomerRevenue = totalRevenue - newCustomerRevenue

    // Get top revenue sources
    const topSources = await prisma.$queryRaw<Array<{
      source: string
      total_revenue: number
      customer_count: number
    }>>`
      SELECT 
        c.source,
        SUM(p.amount_cents) / 100.0 as total_revenue,
        COUNT(DISTINCT c.id) as customer_count
      FROM customers c
      JOIN subscriptions s ON s.customer_id = c.id
      JOIN payments p ON p.subscription_id = s.id
      WHERE c.tenant_id = ${BigInt(session.user.tenant_id)}
        AND p.status = 'completed'
        AND p.created_at >= ${startDate}
      GROUP BY c.source
      ORDER BY total_revenue DESC
      LIMIT 5
    `

    // Format revenue trend data for charts
    const revenueTrend = revenueByMonth.map(month => ({
      month: format(new Date(month.month), 'MMM yyyy'),
      revenue: Number(month.total_revenue),
      transactions: Number(month.transaction_count),
    }))

    // Calculate growth rate (comparing last month to previous month)
    const lastMonth = revenueByMonth[revenueByMonth.length - 1]
    const previousMonth = revenueByMonth[revenueByMonth.length - 2]
    const growthRate = previousMonth && Number(previousMonth.total_revenue) > 0
      ? ((Number(lastMonth?.total_revenue || 0) - Number(previousMonth.total_revenue)) / Number(previousMonth.total_revenue)) * 100
      : 0

    return NextResponse.json({
      kpis: {
        total_revenue: Math.round(totalRevenue * 100) / 100,
        mrr: Math.round(mrr * 100) / 100,
        expenses: Math.round(estimatedExpenses * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        profit_margin: Math.round(profitMargin * 100) / 100,
        avg_transaction_value: Math.round(avgTransactionValue * 100) / 100,
        growth_rate: Math.round(growthRate * 100) / 100,
        total_transactions: totalTransactions,
      },
      revenue_trend: revenueTrend,
      gateway_distribution: gatewayDistribution.map(g => ({
        gateway: g.gateway,
        amount: Number(g.total_amount),
        transactions: Number(g.transaction_count),
        percentage: totalRevenue > 0 ? (Number(g.total_amount) / totalRevenue) * 100 : 0,
      })),
      customer_revenue: {
        new_customers: Math.round(newCustomerRevenue * 100) / 100,
        returning_customers: Math.round(returningCustomerRevenue * 100) / 100,
      },
      top_sources: topSources.map(s => ({
        source: s.source,
        revenue: Number(s.total_revenue),
        customers: Number(s.customer_count),
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
