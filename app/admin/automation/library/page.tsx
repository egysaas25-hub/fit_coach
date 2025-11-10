"use client"

import { useState } from "react"
import KPICard from "@/components/workspace/kpi-card"
import DataTable from "@/components/workspace/data-table"
import { Plus, Play, Edit2, Trash2, Bell, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-poppins text-foreground mb-2">Automation Center</h1>
        <p className="text-muted-foreground">Manage workflows, triggers, events, and AI alerts</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active Workflows" value={activeWorkflows} icon="⚙️" trend={{ value: 12, isPositive: true }} />
        <KPICard title="Total Workflows" value={totalWorkflows} icon="📊" />
        <KPICard title="Running Alerts" value={42} icon="🔔" trend={{ value: 8, isPositive: true }} />
        <KPICard title="Failed Runs" value={2} icon="⚠️" trend={{ value: 5, isPositive: false }} />
      </div>

      {/* Workflow List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold font-poppins text-foreground">Workflows</h2>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Create Workflow
          </button>
        </div>

        <DataTable<Workflow>
          columns={[
            {
              key: "name",
              label: "Name",
              sortable: true,
              width: "w-1/4",
            },
            {
              key: "description",
              label: "Description",
              width: "w-1/4",
            },
            {
              key: "status",
              label: "Status",
              sortable: true,
              render: (status) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    status === "Active" ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {status}
                </span>
              ),
              width: "w-1/6",
            },
            {
              key: "lastRun",
              label: "Last Run",
              sortable: true,
              width: "w-1/6",
            },
            {
              key: "id",
              label: "Actions",
              render: (id) => (
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-border rounded transition-colors" title="Run">
                    <Play size={16} className="text-primary" />
                  </button>
                  <button className="p-1 hover:bg-border rounded transition-colors" title="Edit">
                    <Edit2 size={16} className="text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    onClick={() => handleDeleteWorkflow(id)}
                    className="p-1 hover:bg-border rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </button>
                </div>
              ),
            },
          ]}
          data={workflows}
        />
      </div>

      {/* Notification Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold font-poppins text-foreground mb-4 flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            Recent Alerts
          </h2>
          <div className="space-y-3">
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
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm">{alert.msg}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold font-poppins text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="btn-secondary w-full text-left text-sm">+ Test Alert</button>
            <button className="btn-secondary w-full text-left text-sm">+ Import Workflow</button>
            <button className="btn-secondary w-full text-left text-sm">Export Config</button>
          </div>
        </div>
      </div>

      {/* Create Workflow Dialog */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Workflow Name</label>
            <input
              type="text"
              value={newWorkflow.name}
              onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
              placeholder="e.g., Welcome Sequence"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={newWorkflow.description}
              onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
              placeholder="Describe what this workflow does..."
              rows={4}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>
          </div>
          <DialogFooter className="flex gap-3">
            <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreateWorkflow} className="btn-primary">
              Create Workflow
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
