"use client"

import { useState } from "react"
import DataTable from "@/components/workspace/data-table"
import Modal from "@/components/workspace/modal"
import { Plus, Play, Edit2, Trash2 } from "lucide-react"

interface Trigger {
  id: string
  name: string
  eventType: string
  condition: string
  linkedAction: string
  status: "Active" | "Inactive"
}

const mockTriggers: Trigger[] = [
  {
    id: "1",
    name: "Inactivity Alert",
    eventType: "Client Inactivity",
    condition: "No login for 7 days",
    linkedAction: "Send WhatsApp reminder",
    status: "Active",
  },
  {
    id: "2",
    name: "Renewal Due",
    eventType: "Subscription Renewal",
    condition: "30 days before expiry",
    linkedAction: "Send renewal notification",
    status: "Active",
  },
  {
    id: "3",
    name: "Low Adherence Alert",
    eventType: "Performance Anomaly",
    condition: "Adherence < 60%",
    linkedAction: "Send motivational message",
    status: "Active",
  },
  {
    id: "4",
    name: "Payment Failure",
    eventType: "Payment Error",
    condition: "Payment declined",
    linkedAction: "Trigger payment retry",
    status: "Inactive",
  },
]

export default function TriggersPage() {
  const [triggers, setTriggers] = useState<Trigger[]>(mockTriggers)
  const [showModal, setShowModal] = useState(false)
  const [newTrigger, setNewTrigger] = useState({
    name: "",
    eventType: "Client Inactivity",
    condition: "",
    linkedAction: "",
  })

  const handleCreateTrigger = () => {
    if (newTrigger.name && newTrigger.condition && newTrigger.linkedAction) {
      const trigger: Trigger = {
        id: String(Date.now()),
        ...newTrigger,
        status: "Active",
      }
      setTriggers([trigger, ...triggers])
      setNewTrigger({ name: "", eventType: "Client Inactivity", condition: "", linkedAction: "" })
      setShowModal(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-poppins text-foreground mb-2">Triggers & Events</h1>
        <p className="text-muted-foreground">Define conditions and actions for automation</p>
      </div>

      {/* Triggers Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold font-poppins text-foreground">Active Triggers</h2>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Create Trigger
          </button>
        </div>

        <DataTable<Trigger>
          columns={[
            {
              key: "name",
              label: "Trigger Name",
              sortable: true,
            },
            {
              key: "eventType",
              label: "Event Type",
              sortable: true,
            },
            {
              key: "condition",
              label: "Condition",
            },
            {
              key: "linkedAction",
              label: "Linked Action",
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
          data={triggers}
        />
      </div>

      {/* Create Trigger Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Trigger" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Trigger Name</label>
            <input
              type="text"
              value={newTrigger.name}
              onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })}
              placeholder="e.g., Inactivity Alert"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Event Type</label>
            <select
              value={newTrigger.eventType}
              onChange={(e) => setNewTrigger({ ...newTrigger, eventType: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
            >
              <option>Client Inactivity</option>
              <option>Subscription Renewal</option>
              <option>Performance Anomaly</option>
              <option>Payment Error</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Condition</label>
            <input
              type="text"
              value={newTrigger.condition}
              onChange={(e) => setNewTrigger({ ...newTrigger, condition: e.target.value })}
              placeholder="e.g., No login for 7 days"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Linked Action</label>
            <input
              type="text"
              value={newTrigger.linkedAction}
              onChange={(e) => setNewTrigger({ ...newTrigger, linkedAction: e.target.value })}
              placeholder="e.g., Send WhatsApp reminder"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <button onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreateTrigger} className="btn-primary">
              Create Trigger
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
