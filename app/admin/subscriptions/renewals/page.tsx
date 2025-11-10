"use client"

import { useState } from "react"
import DataTable from "@/components/workspace/data-table"
import { Plus, Play, Edit2, Trash2 } from "lucide-react"

interface Renewal {
  id: string
  client: string
  subscriptionPlan: string
  dueDate: string
  reminderDaysBefore: number
  channel: string
  status: "Active" | "Inactive"
}

const mockRenewals: Renewal[] = [
  {
    id: "1",
    client: "Acme Corp",
    subscriptionPlan: "Professional",
    dueDate: "2025-02-15",
    reminderDaysBefore: 30,
    channel: "WhatsApp + Email",
    status: "Active",
  },
  {
    id: "2",
    client: "TechStart Inc",
    subscriptionPlan: "Enterprise",
    dueDate: "2025-02-10",
    reminderDaysBefore: 14,
    channel: "WhatsApp",
    status: "Active",
  },
  {
    id: "3",
    client: "Fitness Pro",
    subscriptionPlan: "Starter",
    dueDate: "2025-02-20",
    reminderDaysBefore: 7,
    channel: "Email",
    status: "Active",
  },
]

export default function RenewalsPage() {
  const [renewals, setRenewals] = useState<Renewal[]>(mockRenewals)
  const [showModal, setShowModal] = useState(false)
  const [config, setConfig] = useState({
    reminderDays: 30,
    channel: "WhatsApp + Email",
    messageTemplate: "Hi {{name}}, your subscription renews in {{days}} days. Ready to continue?",
    retryAttempts: 3,
  })

  // Declare variables days and plan
  const days = 30
  const plan = "Professional"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-poppins text-foreground mb-2">Renewal Automation</h1>
        <p className="text-muted-foreground">Setup renewal reminders and payment retry workflows</p>
      </div>

      {/* Configuration Card */}
      <div className="card">
        <h2 className="text-lg font-semibold font-poppins text-foreground mb-4">Global Renewal Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Reminder Days Before Renewal</label>
            <input
              type="number"
              value={config.reminderDays}
              onChange={(e) => setConfig({ ...config, reminderDays: Number.parseInt(e.target.value) })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Channel</label>
            <select
              value={config.channel}
              onChange={(e) => setConfig({ ...config, channel: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
            >
              <option>WhatsApp</option>
              <option>Email</option>
              <option>WhatsApp + Email</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-2">Message Template</label>
          <p className="text-xs text-muted-foreground mb-2">
            {/* Use {{ name }}, {days}, and {plan} as variables */}
          </p>
          <textarea
            value={config.messageTemplate}
            onChange={(e) => setConfig({ ...config, messageTemplate: e.target.value })}
            rows={3}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-2">Retry Attempts on Payment Failure</label>
          <input
            type="number"
            value={config.retryAttempts}
            onChange={(e) => setConfig({ ...config, retryAttempts: Number.parseInt(e.target.value) })}
            min="1"
            max="5"
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn-primary">Save Configuration</button>
          <button className="btn-secondary flex items-center gap-2">
            <Play size={16} />
            Test Workflow
          </button>
        </div>
      </div>

      {/* Active Renewals */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold font-poppins text-foreground">Upcoming Renewals</h2>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Renewal
          </button>
        </div>

        <DataTable<Renewal>
          columns={[
            {
              key: "client",
              label: "Client",
              sortable: true,
            },
            {
              key: "subscriptionPlan",
              label: "Plan",
              sortable: true,
            },
            {
              key: "dueDate",
              label: "Due Date",
              sortable: true,
            },
            {
              key: "reminderDaysBefore",
              label: "Reminder (Days Before)",
              sortable: true,
            },
            {
              key: "channel",
              label: "Channel",
            },
            {
              key: "status",
              label: "Status",
              render: (status) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    status === "Active" ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {status}
                </span>
              ),
            },
            {
              key: "id",
              label: "Actions",
              render: (id) => (
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-border rounded transition-colors" title="Trigger">
                    <Play size={16} className="text-primary" />
                  </button>
                  <button className="p-1 hover:bg-border rounded transition-colors" title="Edit">
                    <Edit2 size={16} className="text-muted-foreground hover:text-foreground" />
                  </button>
                  <button className="p-1 hover:bg-border rounded transition-colors" title="Delete">
                    <Trash2 size={16} className="text-destructive" />
                  </button>
                </div>
              ),
            },
          ]}
          data={renewals}
        />
      </div>
    </div>
  )
}
