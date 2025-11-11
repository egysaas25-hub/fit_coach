"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Plus, Play, Edit, Trash2, Bell } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table"

interface Workflow {
  id: string
  name: string
  description: string
  status: "Active" | "Inactive"
  lastRun: string
  triggers: number
}

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Client Onboarding",
    description: "Send welcome message and assign plan",
    status: "Active",
    lastRun: "2 hours ago",
    triggers: 3,
  },
  {
    id: "2",
    name: "Renewal Reminder",
    description: "Automated renewal notifications",
    status: "Active",
    lastRun: "1 day ago",
    triggers: 2,
  },
  {
    id: "3",
    name: "Inactivity Alert",
    description: "Alert inactive clients",
    status: "Inactive",
    lastRun: "5 days ago",
    triggers: 1,
  },
  {
    id: "4",
    name: "Follow-up Sequence",
    description: "Weekly follow-up messages",
    status: "Active",
    lastRun: "12 hours ago",
    triggers: 4,
  },
  {
    id: "5",
    name: "Payment Failure Alert",
    description: "Notify on payment failures",
    status: "Active",
    lastRun: "3 hours ago",
    triggers: 2,
  },
]

export default function AutomationOverviewPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({ name: "", description: "" })

  const activeWorkflows = workflows.filter((w) => w.status === "Active").length
  const totalWorkflows = workflows.length

  const handleCreateWorkflow = () => {
    if (newWorkflow.name && newWorkflow.description) {
      const workflow: Workflow = {
        id: String(Date.now()),
        ...newWorkflow,
        status: "Active",
        lastRun: "Just now",
        triggers: 0,
      }
      setWorkflows([workflow, ...workflows])
      setNewWorkflow({ name: "", description: "" })
      setShowCreateModal(false)
    }
  }

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((w) => w.id !== id))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Automation Center</h1>
            <p className="text-muted-foreground">Manage workflows, triggers, events, and AI alerts</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeWorkflows}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWorkflows}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Running Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell>{workflow.name}</TableCell>
                    <TableCell>{workflow.description}</TableCell>
                    <TableCell>
                      <Badge variant={workflow.status === "Active" ? "default" : "secondary"}>
                        {workflow.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{workflow.lastRun}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Run">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteWorkflow(workflow.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Notification Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { type: "success", msg: "Client Onboarding workflow completed for 3 clients" },
                { type: "warning", msg: "Payment failure detected for user@example.com" },
                { type: "info", msg: "Renewal reminder sent to 15 clients" },
              ].map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex items-start gap-3 ${
                    alert.type === "success"
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : alert.type === "warning"
                        ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  }`}
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{alert.msg}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start text-sm">+ Test Alert</Button>
              <Button variant="secondary" className="w-full justify-start text-sm">+ Import Workflow</Button>
              <Button variant="secondary" className="w-full justify-start text-sm">Export Config</Button>
            </CardContent>
          </Card>
        </div>

        {/* Create Workflow Dialog */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Workflow</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-2">Workflow Name</Label>
                <Input
                  type="text"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  placeholder="e.g., Welcome Sequence"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-2">Description</Label>
                <Textarea
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  placeholder="Describe what this workflow does..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkflow}>
                Create Workflow
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}