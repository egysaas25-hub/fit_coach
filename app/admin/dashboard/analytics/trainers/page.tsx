"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/shared/data-display/StatCard"
import {
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  Activity,
  Target,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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

interface TrainerAnalytics {
  kpis: {
    totalTrainers: number
    avgResponseTime: number
    avgCheckinsHandled: number
    avgWorkloadIndex: number
    slaCompliance: number
  }
  workloadDistribution: Array<{
    trainer: string
    workload: number
    assignedClients: number
    maxCaseload: number
  }>
  responseTimeTrend: Array<{
    date: string
    avgResponseTime: number
  }>
  performanceComparison: Array<{
    trainer: string
    responseTime: number
    adherenceImprovement: number
    clientSatisfaction: number
    slaCompliance: number
  }>
  leaderboard: Array<{
    id: string
    name: string
    role: string
    assignedClients: number
    avgResponseTime: number
    slaCompliance: number
    workloadIndex: number
  }>
}

export default function TrainerAnalyticsPage() {
  const { data, isLoading, error } = useQuery<TrainerAnalytics>({
    queryKey: ['trainer-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/trainers', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch trainer analytics')
      }

      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainer Analytics</h1>
          <p className="text-muted-foreground">
            Monitor team performance and workload distribution
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {[...Array(5)].map((_, i) => (
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
          <h1 className="text-3xl font-bold tracking-tight">Trainer Analytics</h1>
          <p className="text-destructive">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trainer Analytics</h1>
        <p className="text-muted-foreground">
          Monitor team performance and workload distribution
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard
          title="Total Trainers"
          value={data.kpis.totalTrainers}
          icon={Users}
          trend={0}
        />
        <StatCard
          title="Avg Response Time"
          value={`${data.kpis.avgResponseTime}m`}
          icon={Clock}
          trend={-5}
          trendLabel="vs last month"
        />
        <StatCard
          title="Avg Check-ins"
          value={data.kpis.avgCheckinsHandled}
          icon={CheckCircle2}
          trend={8}
          trendLabel="vs last month"
        />
        <StatCard
          title="Avg Workload"
          value={`${data.kpis.avgWorkloadIndex}%`}
          icon={Activity}
          trend={3}
          trendLabel="vs last month"
        />
        <StatCard
          title="SLA Compliance"
          value={`${data.kpis.slaCompliance}%`}
          icon={Target}
          trend={2}
          trendLabel="vs last month"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Workload Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Workload Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.workloadDistribution}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="trainer"
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
                dataKey="workload"
                fill="hsl(var(--primary))"
                name="Workload %"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Response Time Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Response Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.responseTimeTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
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
                dataKey="avgResponseTime"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Avg Response Time (min)"
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Comparison Radar Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data.performanceComparison}>
            <PolarGrid className="stroke-muted" />
            <PolarAngleAxis
              dataKey="trainer"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Radar
              name="Response Time Score"
              dataKey="responseTime"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
            <Radar
              name="Adherence Improvement"
              dataKey="adherenceImprovement"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.3}
            />
            <Radar
              name="Client Satisfaction"
              dataKey="clientSatisfaction"
              stroke="hsl(var(--chart-3))"
              fill="hsl(var(--chart-3))"
              fillOpacity={0.3}
            />
            <Radar
              name="SLA Compliance"
              dataKey="slaCompliance"
              stroke="hsl(var(--chart-4))"
              fill="hsl(var(--chart-4))"
              fillOpacity={0.3}
            />
            <Legend />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Leaderboard */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Trainer Leaderboard</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Clients</TableHead>
              <TableHead>Avg Response</TableHead>
              <TableHead>SLA Compliance</TableHead>
              <TableHead>Workload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.leaderboard.map((trainer, index) => (
              <TableRow key={trainer.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {index === 0 && <span className="text-2xl">🥇</span>}
                    {index === 1 && <span className="text-2xl">🥈</span>}
                    {index === 2 && <span className="text-2xl">🥉</span>}
                    {index > 2 && <span className="font-semibold">#{index + 1}</span>}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{trainer.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {trainer.role.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{trainer.assignedClients}</TableCell>
                <TableCell>{trainer.avgResponseTime}m</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${trainer.slaCompliance}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {trainer.slaCompliance}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      trainer.workloadIndex < 70
                        ? 'bg-green-500/10 text-green-500'
                        : trainer.workloadIndex < 90
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-red-500/10 text-red-500'
                    }
                  >
                    {trainer.workloadIndex}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
