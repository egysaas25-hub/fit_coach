'use client'

import { useQuery } from '@tanstack/react-query'
import AdminLayout from '@/components/layouts/AdminLayout'
import { StatCard } from '@/components/shared/data-display/StatCard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react'
import { downloadCSV, formatCurrency as formatCurrencyCSV, formatPercentage as formatPercentageCSV } from '@/lib/utils/csv-generator'

interface BusinessAnalytics {
  kpis: {
    total_revenue: number
    mrr: number
    expenses: number
    profit: number
    profit_margin: number
    avg_transaction_value: number
    growth_rate: number
    total_transactions: number
  }
  revenue_trend: Array<{
    month: string
    revenue: number
    transactions: number
  }>
  gateway_distribution: Array<{
    gateway: string
    amount: number
    transactions: number
    percentage: number
  }>
  customer_revenue: {
    new_customers: number
    returning_customers: number
  }
  top_sources: Array<{
    source: string
    revenue: number
    customers: number
  }>
}

const COLORS = ['#00C26A', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function BusinessAnalyticsPage() {
  const { data, isLoading } = useQuery<BusinessAnalytics>({
    queryKey: ['business-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/business?months=12', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch business analytics')
      }

      return response.json()
    },
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const handleExport = () => {
    if (!data) {
      return
    }

    // Prepare comprehensive export data
    const exportData = [
      // KPIs Section
      { section: 'KPIs', metric: 'Total Revenue', value: formatCurrencyCSV(data.kpis.total_revenue) },
      { section: 'KPIs', metric: 'MRR', value: formatCurrencyCSV(data.kpis.mrr) },
      { section: 'KPIs', metric: 'Expenses', value: formatCurrencyCSV(data.kpis.expenses) },
      { section: 'KPIs', metric: 'Profit', value: formatCurrencyCSV(data.kpis.profit) },
      { section: 'KPIs', metric: 'Profit Margin', value: formatPercentageCSV(data.kpis.profit_margin) },
      { section: 'KPIs', metric: 'Avg Transaction Value', value: formatCurrencyCSV(data.kpis.avg_transaction_value) },
      { section: 'KPIs', metric: 'Growth Rate', value: formatPercentageCSV(data.kpis.growth_rate) },
      { section: 'KPIs', metric: 'Total Transactions', value: data.kpis.total_transactions },
      { section: '', metric: '', value: '' }, // Empty row
      
      // Revenue Trend Section
      { section: 'Revenue Trend', metric: 'Month', value: 'Revenue', extra1: 'Transactions' },
      ...data.revenue_trend.map(item => ({
        section: 'Revenue Trend',
        metric: item.month,
        value: formatCurrencyCSV(item.revenue),
        extra1: item.transactions,
      })),
      { section: '', metric: '', value: '' }, // Empty row
      
      // Payment Gateway Distribution
      { section: 'Payment Gateways', metric: 'Gateway', value: 'Amount', extra1: 'Transactions', extra2: 'Percentage' },
      ...data.gateway_distribution.map(item => ({
        section: 'Payment Gateways',
        metric: item.gateway,
        value: formatCurrencyCSV(item.amount),
        extra1: item.transactions,
        extra2: formatPercentageCSV(item.percentage),
      })),
      { section: '', metric: '', value: '' }, // Empty row
      
      // Customer Revenue
      { section: 'Customer Revenue', metric: 'Type', value: 'Amount' },
      { section: 'Customer Revenue', metric: 'New Customers', value: formatCurrencyCSV(data.customer_revenue.new_customers) },
      { section: 'Customer Revenue', metric: 'Returning Customers', value: formatCurrencyCSV(data.customer_revenue.returning_customers) },
      { section: '', metric: '', value: '' }, // Empty row
      
      // Top Revenue Sources
      { section: 'Top Sources', metric: 'Source', value: 'Revenue', extra1: 'Customers', extra2: 'Avg per Customer' },
      ...data.top_sources.map(item => ({
        section: 'Top Sources',
        metric: item.source,
        value: formatCurrencyCSV(item.revenue),
        extra1: item.customers,
        extra2: formatCurrencyCSV(item.revenue / item.customers),
      })),
    ]

    downloadCSV(exportData, {
      filename: 'business-analytics',
      columns: [
        { key: 'section', header: 'Section' },
        { key: 'metric', header: 'Metric' },
        { key: 'value', header: 'Value' },
        { key: 'extra1', header: 'Additional 1' },
        { key: 'extra2', header: 'Additional 2' },
      ],
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Business Analytics</h1>
            <p className="text-muted-foreground">
              Track revenue, expenses, and financial performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} disabled={!data}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(data.kpis.total_revenue)}
              icon={DollarSign}
              trend={{
                value: data.kpis.growth_rate,
                isPositive: data.kpis.growth_rate >= 0
              }}
              description="vs last month"
            />
            <StatCard
              title="MRR"
              value={formatCurrency(data.kpis.mrr)}
              icon={TrendingUp}
              description="Monthly Recurring Revenue"
            />
            <StatCard
              title="Profit"
              value={formatCurrency(data.kpis.profit)}
              icon={data.kpis.profit >= 0 ? TrendingUp : TrendingDown}
              trend={{
                value: data.kpis.profit_margin,
                isPositive: data.kpis.profit_margin >= 0
              }}
              description="margin"
            />
            <StatCard
              title="Avg Transaction"
              value={formatCurrency(data.kpis.avg_transaction_value)}
              icon={DollarSign}
              description={`${data.kpis.total_transactions} transactions`}
            />
          </div>
        ) : null}

        {/* Revenue Trend Chart */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <p className="text-sm text-muted-foreground">
              Monthly revenue over the last 12 months
            </p>
          </div>
          {isLoading ? (
            <Skeleton className="h-80" />
          ) : data ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.revenue_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00C26A"
                  strokeWidth={2}
                  dot={{ fill: '#00C26A' }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : null}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Gateway Distribution */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Payment Gateways</h3>
              <p className="text-sm text-muted-foreground">
                Revenue distribution by payment method
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : data ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data.gateway_distribution}
                      dataKey="amount"
                      nameKey="gateway"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: any) => `${entry.gateway}: ${entry.percentage.toFixed(1)}%`}
                    >
                      {data.gateway_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {data.gateway_distribution.map((gateway, index) => (
                    <div key={gateway.gateway} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{gateway.gateway}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(gateway.amount)}</div>
                        <div className="text-xs text-muted-foreground">
                          {gateway.transactions} transactions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>

          {/* Customer Revenue Split */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Customer Revenue</h3>
              <p className="text-sm text-muted-foreground">
                New vs returning customer revenue
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : data ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      {
                        name: 'New Customers',
                        value: data.customer_revenue.new_customers,
                      },
                      {
                        name: 'Returning',
                        value: data.customer_revenue.returning_customers,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="value" fill="#00C26A" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">
                      {formatCurrency(data.customer_revenue.new_customers)}
                    </div>
                    <div className="text-sm text-muted-foreground">New Customers</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">
                      {formatCurrency(data.customer_revenue.returning_customers)}
                    </div>
                    <div className="text-sm text-muted-foreground">Returning</div>
                  </div>
                </div>
              </div>
            ) : null}
          </Card>
        </div>

        {/* Top Revenue Sources */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Top Revenue Sources</h3>
            <p className="text-sm text-muted-foreground">
              Highest performing acquisition channels
            </p>
          </div>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : data ? (
            <div className="space-y-3">
              {data.top_sources.map((source, index) => (
                <div
                  key={source.source}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-muted-foreground">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium capitalize">{source.source}</div>
                      <div className="text-sm text-muted-foreground">
                        {source.customers} customers
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatCurrency(source.revenue)}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(source.revenue / source.customers)} avg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </Card>
      </div>
    </AdminLayout>
  )
}
