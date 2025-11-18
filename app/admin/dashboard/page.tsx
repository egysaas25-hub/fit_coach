"use client"

import { StatCard } from "@/components/shared/data-display/StatCard"
import { Users, DollarSign, TrendingUp, AlertCircle, Calendar, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  // Mock user data (will come from auth context)
  const user = {
    name: "Ahmed Reda",
    email: "ahmed@trainersaas.com",
    role: "admin",
  }

  // Mock data (will come from API)
  const stats = {
    activeClients: 128,
    renewalsDue: 12,
    mrr: "$45,280",
    pendingTickets: 5,
    newLeads: 23,
    unreadMessages: 8,
  }

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}. Here's what's happening today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Active Clients"
            value={stats.activeClients}
            description="from last month"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            onClick={() => console.log("Navigate to clients")}
          />
          <StatCard
            title="Renewals Due"
            value={stats.renewalsDue}
            description="next 14 days"
            icon={Calendar}
            trend={{ value: 3, isPositive: false }}
            onClick={() => console.log("Navigate to renewals")}
          />
          <StatCard
            title="Monthly Revenue"
            value={stats.mrr}
            description="MRR"
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
            onClick={() => console.log("Navigate to revenue")}
          />
          <StatCard
            title="Pending Tickets"
            value={stats.pendingTickets}
            description="requires attention"
            icon={AlertCircle}
            onClick={() => console.log("Navigate to tickets")}
          />
          <StatCard
            title="New Leads"
            value={stats.newLeads}
            description="this week"
            icon={TrendingUp}
            trend={{ value: 15, isPositive: true }}
            onClick={() => console.log("Navigate to leads")}
          />
          <StatCard
            title="Unread Messages"
            value={stats.unreadMessages}
            description="across all channels"
            icon={MessageSquare}
            onClick={() => console.log("Navigate to messages")}
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start">
                <Users className="mr-2 h-4 w-4" />
                Add Client
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Assign Plan
              </Button>
              <Button variant="outline" className="justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Broadcast Message
              </Button>
              <Button variant="outline" className="justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest client interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { client: "Sara Ahmed", action: "Completed check-in", time: "2 hours ago" },
                  { client: "Omar Hassan", action: "Sent progress photo", time: "4 hours ago" },
                  { client: "Mina Adel", action: "Renewed subscription", time: "5 hours ago" },
                  { client: "John Doe", action: "Asked nutrition question", time: "6 hours ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{activity.client}</p>
                      <p className="text-xs text-muted-foreground">{activity.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Renewals Timeline</CardTitle>
              <CardDescription>Upcoming subscription renewals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { client: "C102 – Sara Ahmed", plan: "3-Month Fat Loss", date: "Nov 20" },
                  { client: "C097 – Omar Hassan", plan: "6-Month Hypertrophy", date: "Nov 22" },
                  { client: "C056 – Mina Adel", plan: "3-Month Rehab", date: "Nov 25" },
                  { client: "C045 – Lara Smith", plan: "12-Month Performance", date: "Nov 28" },
                ].map((renewal, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{renewal.client}</p>
                      <p className="text-xs text-muted-foreground">{renewal.plan}</p>
                    </div>
                    <span className="text-xs font-medium">{renewal.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
