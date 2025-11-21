'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layouts/AdminLayout'
import { StatCard } from '@/components/shared/data-display/StatCard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Users, TrendingUp, TrendingDown, AlertTriangle, Download } from 'lucide-react'
import { format } from 'date-fns'
import { downloadCSV, formatPercentage as formatPercentageCSV, formatDate } from '@/lib/utils/csv-generator'

interface ClientAnalytics {
  kpis: {
    total_clients: number
    active_clients: number
    active_percentage: number
    churn_rate: number
    retention_rate: number
    avg_engagement_score: number
    expired_clients: number
  }
  growth_trend: Array<{
    month: string
    new_clients: number
    churned_clients: number
    net_growth: number
  }>
  engagement_distribution: Array<{
    level: string
    count: number
    percentage: number
  }>
  clients_by_status: Array<{
    status: string
    count: number
    percentage: number
  }>
  clients_by_goal: Array<{
    goal: string
    count: number
  }>
  predicted_churn: Array<{
    id: string
    client_code: string
    name: string
    last_interaction: Date | null
    subscription_end: Date | null
    risk_score: number
  }>
}

const COLORS = ['#00C26A', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function ClientAnalyticsPage() {
  const router = useRouter()

  const { data, isLoading } = useQuery<ClientAnalytics>({
    queryKey: ['client-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/clients?months=12', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch client analytics')
      }

      return response.json()
    },
  })

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600'
    if (score >= 60) return 'text-orange-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <Badge variant="destructive">Critical</Badge>
    if (score >= 60) return <Badge className="bg-orange-500">High</Badge>
    if (score >= 40) return <Badge className="bg-yellow-500">Medium</Badge>
    return <Badge className="bg-green-500">Low</Badge>
  }

  const handleExportCSV = () => {
    if (!data) {
      return
    }

    // Prepare comprehensive export data
    const exportData = [
      // KPIs Section
      { section: 'KPIs', metric: 'Total Clients', value: data.kpis.total_clients },
      { section: 'KPIs', metric: 'Active Clients', value: data.kpis.active_clients },
      { section: 'KPIs', metric: 'Active Percentage', value: formatPercentageCSV(data.kpis.active_percentage) },
      { section: 'KPIs', metric: 'Churn Rate', value: formatPercentageCSV(data.kpis.churn_rate) },
      { section: 'KPIs', metric: 'Retention Rate', value: formatPercentageCSV(data.kpis.retention_rate) },
      { section: 'KPIs', metric: 'Avg Engagement Score', value: data.kpis.avg_engagement_score },
      { section: 'KPIs', metric: 'Expired Clients', value: data.kpis.expired_clients },
      { section: '', metric: '', value: '' }, // Empty row
      
      // Growth Trend Section
      { section: 'Growth Trend', metric: 'Month', value: 'New Clients', extra1: 'Churned Clients', extra2: 'Net Growth' },
      ...data.growth_trend.map(item => ({
        section: 'Growth Trend',
        metric: item.month,
        value: item.new_clients,
        extra1: item.churned_clients,
        extra2: item.net_growth,
      })),
      { section: '', metric: '', value: '' }, // Empty row
      
      // Engagement Distribution
      { section: 'Engagement', metric: 'Level', value: 'Count', extra1: 'Percentage' },
      ...data.engagement_distribution.map(item => ({
        section: 'Engagement',
        metric: item.level,
        value: item.count,
        extra1: formatPercentageCSV(item.percentage),
      })),
      { section: '', metric: '', value: '' }, // Empty row
      
      // Clients by Status
      { section: 'Status Distribution', metric: 'Status', value: 'Count', extra1: 'Percentage' },
      ...data.clients_by_status.map(item => ({
        section: 'Status Distribution',
        metric: item.status,
        value: item.count,
        extra1: formatPercentageCSV(item.percentage),
      })),
      { section: '', metric: '', value: '' }, // Empty row
      
      // Top Goals
      { section: 'Top Goals', metric: 'Goal', value: 'Count' },
      ...data.clients_by_goal.map(item => ({
        section: 'Top Goals',
        metric: item.goal,
        value: item.count,
      })),
      { section: '', metric: '', value: '' }, // Empty row
      
      // Predicted Churn
      { section: 'Churn Risk', metric: 'Client', value: 'Code', extra1: 'Risk Score', extra2: 'Last Interaction' },
      ...data.predicted_churn.map(item => ({
        section: 'Churn Risk',
        metric: item.name,
        value: item.client_code,
        extra1: item.risk_score,
        extra2: item.last_interaction ? formatDate(item.last_interaction) : 'Never',
      })),
    ]

    downloadCSV(exportData, {
      filename: 'client-analytics',
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
            <h1 className="text-3xl font-bold">Client Analytics</h1>
            <p className="text-muted-foreground">
              Track client growth, retention, and engagement
            </p>
          </div>
          <Button variant="outline" onClick={handleExportCSV} disabled={!data}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* KPI Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Clients"
              value={data.kpis.total_clients.toString()}
              icon={Users}
              description="All time"
            />
            <StatCard
              title="Active Clients"
              value={data.kpis.active_clients.toString()}
              icon={TrendingUp}
              description={`${formatPercentage(data.kpis.active_percentage)} of total`}
            />
            <StatCard
              title="Churn Rate"
              value={formatPercentage(data.kpis.churn_rate)}
              icon={TrendingDown}
              description="This month"
            />
            <StatCard
              title="Retention Rate"
              value={formatPercentage(data.kpis.retention_rate)}
              icon={TrendingUp}
              description="This month"
            />
            <StatCard
              title="Engagement Score"
              value={data.kpis.avg_engagement_score.toString()}
              icon={Users}
              description="Average score"
            />
            <StatCard
              title="Expired Clients"
              value={data.kpis.expired_clients.toString()}
              icon={AlertTriangle}
              description="Need attention"
            />
          </div>
        ) : null}

        {/* Client Growth Trend */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Client Growth Trend</h3>
            <p className="text-sm text-muted-foreground">
              New clients, churned clients, and net growth over time
            </p>
          </div>
          {isLoading ? (
            <Skeleton className="h-80" />
          ) : data ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.growth_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="new_clients"
                  stroke="#00C26A"
                  strokeWidth={2}
                  name="New Clients"
                />
                <Line
                  type="monotone"
                  dataKey="churned_clients"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Churned"
                />
                <Line
                  type="monotone"
                  dataKey="net_growth"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Net Growth"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : null}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clients by Status */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Clients by Status</h3>
              <p className="text-sm text-muted-foreground">
                Distribution across all statuses
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : data ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data.clients_by_status}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: any) => `${entry.status}: ${entry.percentage.toFixed(1)}%`}
                    >
                      {data.clients_by_status.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {data.clients_by_status.map((status, index) => (
                    <div key={status.status} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="capitalize">{status.status}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{status.count}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatPercentage(status.percentage)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>

          {/* Engagement Distribution */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Engagement Levels</h3>
              <p className="text-sm text-muted-foreground">
                Client engagement distribution
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : data ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.engagement_distribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="level" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#00C26A" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4">
                  {data.engagement_distribution.map((level) => (
                    <div key={level.level} className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">{level.count}</div>
                      <div className="text-xs text-muted-foreground capitalize">{level.level}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatPercentage(level.percentage)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>
        </div>

        {/* Top Goals */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Top Client Goals</h3>
            <p className="text-sm text-muted-foreground">
              Most common fitness goals
            </p>
          </div>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : data ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {data.clients_by_goal.map((goal, index) => (
                <div
                  key={goal.goal}
                  className="text-center p-4 bg-muted/50 rounded-lg"
                >
                  <div className="text-3xl font-bold text-primary">{goal.count}</div>
                  <div className="text-sm capitalize mt-2">{goal.goal}</div>
                </div>
              ))}
            </div>
          ) : null}
        </Card>

        {/* Predicted Churn List */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Predicted Churn Risk
              </h3>
              <p className="text-sm text-muted-foreground">
                Clients at risk of churning based on engagement
              </p>
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-96" />
          ) : data && data.predicted_churn.length > 0 ? (
            <div className="space-y-3">
              {data.predicted_churn.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => router.push(`/admin/clients/${client.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      {getRiskBadge(client.risk_score)}
                    </div>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {client.client_code}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getRiskColor(client.risk_score)}`}>
                      {client.risk_score}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {client.last_interaction
                        ? `Last: ${format(new Date(client.last_interaction), 'MMM d')}`
                        : 'No interaction'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No clients at risk of churning</p>
              <p className="text-sm">Great job maintaining engagement!</p>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
