"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Monitor, Smartphone, Tablet, Search } from "lucide-react"

export function SessionManagement() {
  const sessions = [
    {
      id: "SES-2024-001",
      device: "Chrome on Windows",
      location: "New York, USA",
      ip: "192.168.1.100",
      lastActive: "2 minutes ago",
      status: "Active",
      icon: Monitor,
    },
    {
      id: "SES-2024-002",
      device: "Safari on iPhone",
      location: "Los Angeles, USA",
      ip: "192.168.1.101",
      lastActive: "1 hour ago",
      status: "Active",
      icon: Smartphone,
    },
    {
      id: "SES-2024-003",
      device: "Firefox on MacOS",
      location: "Chicago, USA",
      ip: "192.168.1.102",
      lastActive: "3 hours ago",
      status: "Inactive",
      icon: Monitor,
    },
    {
      id: "SES-2024-004",
      device: "Chrome on Android",
      location: "Houston, USA",
      ip: "192.168.1.103",
      lastActive: "1 day ago",
      status: "Inactive",
      icon: Smartphone,
    },
    {
      id: "SES-2024-005",
      device: "Safari on iPad",
      location: "Phoenix, USA",
      ip: "192.168.1.104",
      lastActive: "5 minutes ago",
      status: "Active",
      icon: Tablet,
    },
    {
      id: "SES-2024-006",
      device: "Edge on Windows",
      location: "Philadelphia, USA",
      ip: "192.168.1.105",
      lastActive: "2 days ago",
      status: "Inactive",
      icon: Monitor,
    },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Session Management</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage active user sessions</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Terminate All Sessions</Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sessions by device, location, or IP..."
              className="pl-10 bg-background border-border"
            />
          </div>
          <Button variant="outline" className="border-border bg-transparent">
            Filter
          </Button>
        </div>
      </Card>

      {/* Sessions Table */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Active Sessions</h3>
              <p className="text-sm text-muted-foreground">
                {sessions.filter((s) => s.status === "Active").length} active sessions
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Session ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Device</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">IP Address</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Active</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const Icon = session.icon
                  return (
                    <tr key={session.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm text-foreground font-mono">{session.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{session.device}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{session.location}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">{session.ip}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{session.lastActive}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            session.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          Terminate
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Sessions</p>
            <p className="text-3xl font-bold text-foreground">{sessions.length}</p>
            <p className="text-xs text-muted-foreground">All time</p>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Active Now</p>
            <p className="text-3xl font-bold text-emerald-500">
              {sessions.filter((s) => s.status === "Active").length}
            </p>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Avg Session Duration</p>
            <p className="text-3xl font-bold text-foreground">2.5h</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
