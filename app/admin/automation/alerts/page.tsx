"use client"

import { useState } from "react"
import DataTable from "@/components/workspace/data-table"
import { Plus, Play, Edit2, Trash2, AlertCircle } from "lucide-react"
import Modal from "@/components/workspace/modal"

interface Alert {
  id: string
  type: "Inactivity" | "Renewal" | "Anomaly"
  threshold: string
  channel: string
  messageTemplate: string
  status: "Active" | "Inactive"
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "Inactivity",
    threshold: "No login for 7 days",
    channel: "WhatsApp",
    messageTemplate: "Hi {{name}}, we noticed you haven't logged in recently. How can we help?",
    status: "Active",
  },
  {
    id: "2",
    type: "Renewal",
    threshold: "30 days before renewal",
    channel: "WhatsApp",
    messageTemplate: "Hi {{name}}, your subscription renews in 30 days. Ready to continue?",
    status: "Active",
  },
  {
    id: "3",
    type: "Anomaly",
    threshold: "Adherence < 60%",
    channel: "WhatsApp",
    messageTemplate: "Hey {{name}}, your adherence is low! Let's chat about how to improve.",
    status: "Active",
  },
]

export default function AIAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [showModal, setShowModal] = useState(false)
  const [newAlert, setNewAlert] = useState({
    type: "Inactivity" as const,
    threshold: "",
    messageTemplate: "",
  })

  const handleCreateAlert = () => {
    if (newAlert.threshold && newAlert.messageTemplate) {
      const alert: Alert = {
        id: String(Date.now()),
        ...newAlert,
        channel: "WhatsApp",
        status: "Active",
      }
      setAlerts([alert, ...alerts])
      setNewAlert({ type: "Inactivity", threshold: "", messageTemplate: "" })
      setShowModal(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-poppins text-foreground mb-2">AI Alerts Configuration</h1>
        <p className="text-muted-foreground">Setup AI-driven WhatsApp alerts for your clients</p>
      </div>

      {/* Info Banner */}
      <div className="flex gap-3 p-4 rounded-lg border border-blue-500/30 bg-blue-500/10">
        <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-300">WhatsApp integration is active. All alerts will be sent via WhatsApp.</p>
      </div>

      {/* Alerts Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold font-poppins text-foreground">Active Alerts</h2>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Create Alert
          </button>
        </div>

        <DataTable<Alert>
          columns={[
            {
              key: "type",
              label: "Alert Type",
              sortable: true,
              render: (type) => (
                <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-semibold">{type}</span>
              ),
            },
            {
              key: "threshold",
              label: "Threshold",
            },
            {
              key: "channel",
              label: "Channel",
              render: () => "WhatsApp",
            },
            {
              key: "messageTemplate",
              label: "Message Template",
              render: (template) => <div className="max-w-xs truncate text-muted-foreground text-sm">{template}</div>,
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
                  <button className="p-1 hover:bg-border rounded transition-colors" title="Test">
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
          data={alerts}
        />
      </div>

      {/* Create Alert Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create AI Alert" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Alert Type</label>
            <select
              value={newAlert.type}
              onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as any })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
            >
              <option>Inactivity</option>
              <option>Renewal</option>
              <option>Anomaly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Threshold</label>
            <input
              type="text"
              value={newAlert.threshold}
              onChange={(e) => setNewAlert({ ...newAlert, threshold: e.target.value })}
              placeholder="e.g., No login for 7 days"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Message Template</label>
            <p className="text-xs text-muted-foreground mb-2">
              {/* Use {{ name }} and {{ client_name }} as variables */}
            </p>
            <textarea
              value={newAlert.messageTemplate}
              onChange={(e) => setNewAlert({ ...newAlert, messageTemplate: e.target.value })}
              placeholder="e.g., Hi {{name}}, we noticed..."
              rows={4}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <button onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreateAlert} className="btn-primary">
              Create Alert
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
