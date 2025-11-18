"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Zap, Play, Pause, Plus, Settings, Clock, Users, MessageSquare } from "lucide-react"

const automationWorkflows = [
  {
    id: 1,
    name: "Welcome New Client",
    description: "Automatically send welcome message and onboarding materials when a new client signs up",
    trigger: "Client Registration",
    actions: ["Send WhatsApp welcome", "Email onboarding guide", "Schedule first session"],
    status: "active",
    executions: 156,
    successRate: 98,
    lastRun: "2 hours ago",
    category: "Onboarding",
  },
  {
    id: 2,
    name: "Plan Delivery Notification",
    description: "Notify client when their training and nutrition plans are ready for delivery",
    trigger: "Plan Assignment",
    actions: ["Generate PDF", "Send WhatsApp notification", "Create check-in schedule"],
    status: "active",
    executions: 89,
    successRate: 95,
    lastRun: "30 minutes ago",
    category: "Plan Management",
  },
  {
    id: 3,
    name: "Missed Check-in Follow-up",
    description: "Send reminder messages when clients miss their scheduled check-ins",
    trigger: "Missed Check-in",
    actions: ["Send reminder WhatsApp", "Notify trainer", "Reschedule check-in"],
    status: "active",
    executions: 234,
    successRate: 87,
    lastRun: "1 hour ago",
    category: "Engagement",
  },
  {
    id: 4,
    name: "Progress Milestone Celebration",
    description: "Automatically celebrate when clients reach their fitness milestones",
    trigger: "Milestone Achieved",
    actions: ["Send congratulations message", "Update progress badge", "Share achievement"],
    status: "active",
    executions: 67,
    successRate: 100,
    lastRun: "4 hours ago",
    category: "Motivation",
  },
  {
    id: 5,
    name: "Subscription Renewal Reminder",
    description: "Remind clients about upcoming subscription renewals and payment due dates",
    trigger: "7 Days Before Expiry",
    actions: ["Send renewal reminder", "Generate invoice", "Offer renewal discount"],
    status: "paused",
    executions: 45,
    successRate: 92,
    lastRun: "2 days ago",
    category: "Billing",
  },
  {
    id: 6,
    name: "Trainer Workload Alert",
    description: "Alert administrators when trainer workload exceeds capacity limits",
    trigger: "Workload > 90%",
    actions: ["Send admin alert", "Suggest client redistribution", "Block new assignments"],
    status: "active",
    executions: 12,
    successRate: 100,
    lastRun: "1 day ago",
    category: "Team Management",
  },
]

const categories = ["All", "Onboarding", "Plan Management", "Engagement", "Motivation", "Billing", "Team Management"]

export default function AutomationLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredWorkflows = automationWorkflows.filter((workflow) => {
    const matchesCategory = selectedCategory === "All" || workflow.category === selectedCategory
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleWorkflow = (id: number) => {
    // Handle workflow toggle
    console.log(`Toggle workflow ${id}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Automation Library</h1>
          <p className="text-muted-foreground">Manage automated workflows and triggers</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationWorkflows.length}</div>
            <p className="text-xs text-muted-foreground">
              {automationWorkflows.filter(w => w.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automationWorkflows.reduce((sum, w) => sum + w.executions, 0)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(automationWorkflows.reduce((sum, w) => sum + w.successRate, 0) / automationWorkflows.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Average across all workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47h</div>
            <p className="text-xs text-muted-foreground">Estimated this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{workflow.name}</h3>
                    <Badge variant="outline">{workflow.category}</Badge>
                    <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                      {workflow.status}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{workflow.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Trigger</p>
                      <p className="font-medium text-foreground">{workflow.trigger}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Executions</p>
                      <p className="font-medium text-foreground">{workflow.executions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                      <p className="font-medium text-foreground">{workflow.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Run</p>
                      <p className="font-medium text-foreground">{workflow.lastRun}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Actions</p>
                    <div className="flex flex-wrap gap-1">
                      {workflow.actions.map((action, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3 ml-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={workflow.status === "active"}
                      onCheckedChange={() => toggleWorkflow(workflow.id)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {workflow.status === "active" ? "Active" : "Paused"}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      View Logs
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No workflows found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or category filter
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Workflow
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}