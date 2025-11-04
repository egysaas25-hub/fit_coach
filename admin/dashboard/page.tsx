"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertCircle,
  UserPlus,
  FileText,
  Send,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => apiClient.getDashboardStats(),
  })

  if (isLoading) {
    return <DashboardSkeleton />
  }

  const kpis = [
    {
      title: "Active Clients",
      value: stats?.activeClients || 0,
      change: stats?.clientGrowth || 0,
      icon: Users,
      trend: "up",
      href: "/admin/clients",
    },
    {
      title: "Renewals Due",
      value: stats?.renewalsDue || 0,
      change: -5.2,
      icon: Calendar,
      trend: "down",
      href: "/admin/clients?filter=renewals",
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      change: stats?.revenueGrowth || 0,
      icon: DollarSign,
      trend: "up",
      href: "/admin/analytics/business",
    },
    {
      title: "Pending Tickets",
      value: stats?.pendingTickets || 0,
      change: -12.5,
      icon: AlertCircle,
      trend: "down",
      href: "/admin/support",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Operational heartbeat and key performance indicators</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground">
            <Send className="w-4 h-4 mr-2" />
            Broadcast
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          const isPositive = kpi.trend === "up"
          const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight

          return (
            <Link key={kpi.title} href={kpi.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendIcon className={`w-3 h-3 ${isPositive ? "text-primary" : "text-destructive"}`} />
                    <span className={`text-xs font-medium ${isPositive ? "text-primary" : "text-destructive"}`}>
                      {Math.abs(kpi.change)}%
                    </span>
                    <span className="text-xs text-muted-foreground">vs last 30 days</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start bg-transparent" asChild>
              <Link href="/admin/clients/new">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Client
              </Link>
            </Button>
            <Button variant="outline" className="justify-start bg-transparent" asChild>
              <Link href="/admin/programs/new">
                <FileText className="w-4 h-4 mr-2" />
                Assign Plan
              </Link>
            </Button>
            <Button variant="outline" className="justify-start bg-transparent" asChild>
              <Link href="/admin/messages">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Link>
            </Button>
            <Button variant="outline" className="justify-start bg-transparent" asChild>
              <Link href="/admin/analytics">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Reports
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest client interactions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
              <CardDescription>Important updates requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>Recommendations and predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <AIInsights />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: "client",
      message: "Client Alex completed workout",
      time: "1 hour ago",
      icon: Users,
    },
    {
      id: 2,
      type: "message",
      message: "Client Jordan logged nutrition",
      time: "2 hours ago",
      icon: Send,
    },
    {
      id: 3,
      type: "renewal",
      message: "Client Sarah subscription renewed",
      time: "3 hours ago",
      icon: Calendar,
    },
    {
      id: 4,
      type: "alert",
      message: "Client Mike missed check-in",
      time: "4 hours ago",
      icon: AlertCircle,
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activity.icon
        return (
          <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AlertsList() {
  const alerts = [
    {
      id: 1,
      title: "12 Renewals Due This Week",
      description: "Follow up with clients for subscription renewals",
      severity: "warning",
    },
    {
      id: 2,
      title: "3 Clients Inactive >30 Days",
      description: "Re-engagement campaign recommended",
      severity: "alert",
    },
    {
      id: 3,
      title: "Payment Gateway Issue",
      description: "Stripe integration needs attention",
      severity: "critical",
    },
  ]

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border ${
            alert.severity === "critical"
              ? "bg-destructive/10 border-destructive/20"
              : alert.severity === "warning"
                ? "bg-warning/10 border-warning/20"
                : "bg-primary/10 border-primary/20"
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className={`w-5 h-5 flex-shrink-0 ${
                alert.severity === "critical"
                  ? "text-destructive"
                  : alert.severity === "warning"
                    ? "text-warning"
                    : "text-primary"
              }`}
            />
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-foreground">{alert.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AIInsights() {
  const insights = [
    {
      id: 1,
      title: "Churn Risk Detected",
      description: "5 clients showing low engagement patterns",
      action: "View Details",
      href: "/admin/analytics/clients",
    },
    {
      id: 2,
      title: "Revenue Opportunity",
      description: "23 clients eligible for premium upgrade",
      action: "Create Campaign",
      href: "/admin/campaigns/new",
    },
    {
      id: 3,
      title: "Trainer Performance",
      description: "Sarah Miller has 95% satisfaction rate",
      action: "View Report",
      href: "/admin/analytics/trainers",
    },
  ]

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <div key={insight.id} className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-foreground">{insight.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href={insight.href}>{insight.action}</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
