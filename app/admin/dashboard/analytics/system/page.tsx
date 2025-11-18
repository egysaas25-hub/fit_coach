"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/shared/data-display/StatCard"
import {
  Activity,
  Clock,
  CheckCircle2,
  HardDrive,
  Zap,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface SystemHealthAnalytics {
  kpis: {
    apiLatencyAvg: number
    systemUptime: number
    waDeliverySuccess: number
    storageUsageGB: number
    activeConnections: number
    queueSize: number
  }
  apiResponseTime: Array<{
    timestamp: string
    latency: number
    p95: number
    p99: number
  }>
  waDeliveryTrend: Array<{
    date: string
    success: number
    failed: number
    successRate: number
  }>
  storageUsage: Array<{
    category: string
    sizeGB: number
    percentage: number
  }>
  errorLogs: Array<{
    id: string
    timestamp: string
    level: 'error' | 'warning' | 'info'
    message: string
    count: number
  }>
  systemMetrics: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    networkIn: number
    networkOut: number
  }
}

export default function SystemHealthPage() {
  const { data, isLoading, error } = useQuery<SystemHealthAnalytics>({
    queryKey: ['system-health'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/system', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch system health data')
      }

      return response.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">
            Monitor system performance and infrastructure metrics
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-destructive">Failed to load system health data</p>
        </div>
      </div>
    )
  }

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'text-green-500'
    if (uptime >= 99) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">
            Monitor system performance and infrastructure metrics
          </p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500">
          <Activity className="h-3 w-3 mr-1" />
          System Operational
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <StatCard
          title="API Latency"
          value={`${data.kpis.apiLatencyAvg}ms`}
          icon={Zap}
          trend={-8}
          trendLabel="vs last hour"
        />
        <StatCard
          title="System Uptime"
          value={`${data.kpis.systemUptime}%`}
          icon={Activity}
          trend={0}
          className={getUptimeColor(data.kpis.systemUptime)}
        />
        <StatCard
          title="WA Delivery"
          value={`${data.kpis.waDeliverySuccess}%`}
          icon={MessageSquare}
          trend={2}
          trendLabel="vs yesterday"
        />
        <StatCard
          title="Storage Used"
          value={`${data.kpis.storageUsageGB}GB`}
          icon={HardDrive}
          trend={5}
          trendLabel="vs last week"
        />
        <StatCard
          title="Active Connections"
          value={data.kpis.activeConnections}
          icon={Activity}
          trend={12}
        />
        <StatCard
          title="Queue Size"
          value={data.kpis.queueSize}
          icon={Clock}
          trend={-15}
        />
      </div>

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">CPU Usage</span>
            <span className="text-sm font-semibold">{data.systemMetrics.cpuUsage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                data.systemMetrics.cpuUsage > 80
                  ? 'bg-red-500'
                  : data.systemMetrics.cpuUsage > 60
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${data.systemMetrics.cpuUsage}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Memory Usage</span>
            <span className="text-sm font-semibold">{data.systemMetrics.memoryUsage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                data.systemMetrics.memoryUsage > 80
                  ? 'bg-red-500'
                  : data.systemMetrics.memoryUsage > 60
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${data.systemMetrics.memoryUsage}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Disk Usage</span>
            <span className="text-sm font-semibold">{data.systemMetrics.diskUsage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                data.systemMetrics.diskUsage > 80
                  ? 'bg-red-500'
                  : data.systemMetrics.diskUsage > 60
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${data.systemMetrics.diskUsage}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-2">Network In</div>
          <div className="text-2xl font-bold">{data.systemMetrics.networkIn} MB/s</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-2">Network Out</div>
          <div className="text-2xl font-bold">{data.systemMetrics.networkOut} MB/s</div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* API Response Time */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">API Response Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.apiResponseTime}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'ms', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="latency"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Avg Latency"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="p95"
                stroke="hsl(var(--chart-2))"
                strokeWidth={1}
                strokeDasharray="5 5"
                name="P95"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="p99"
                stroke="hsl(var(--chart-3))"
                strokeWidth={1}
                strokeDasharray="5 5"
                name="P99"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* WhatsApp Delivery Success */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">WhatsApp Delivery Success</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.waDeliveryTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Bar
                dataKey="success"
                fill="hsl(var(--chart-1))"
                name="Success"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="failed"
                fill="hsl(var(--destructive))"
                name="Failed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Storage Usage */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Storage Usage by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.storageUsage} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: 'GB', position: 'insideRight' }}
            />
            <YAxis
              type="category"
              dataKey="category"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Bar
              dataKey="sizeGB"
              fill="hsl(var(--primary))"
              name="Size (GB)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Error Logs */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Error Logs</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.errorLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">
                  {log.timestamp}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      log.level === 'error'
                        ? 'bg-red-500/10 text-red-500'
                        : log.level === 'warning'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-blue-500/10 text-blue-500'
                    }
                  >
                    {log.level.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md truncate">{log.message}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{log.count}x</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
