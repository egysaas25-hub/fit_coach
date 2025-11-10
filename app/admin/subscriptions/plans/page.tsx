"use client"

import { useState } from "react"
import DataTable from "@/components/workspace/data-table"
import { Plus, Edit2, Eye, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Plan {
  id: string
  name: string
  monthlyPrice: number
  features: string
  visibility: "Public" | "Private"
  status: "Active" | "Inactive"
}

const mockPlans: Plan[] = [
  {
    id: "1",
    name: "Starter",
    monthlyPrice: 29,
    features: "Up to 10 clients, Basic analytics, Email support",
    visibility: "Public",
    status: "Active",
  },
  {
    id: "2",
    name: "Professional",
    monthlyPrice: 79,
    features: "Up to 50 clients, Advanced analytics, Priority support, API access",
    visibility: "Public",
    status: "Active",
  },
  {
    id: "3",
    name: "Enterprise",
    monthlyPrice: 199,
    features: "Unlimited clients, Custom analytics, 24/7 support, Dedicated manager",
    visibility: "Public",
    status: "Active",
  },
  {
    id: "4",
    name: "Beta Plan",
    monthlyPrice: 49,
    features: "Testing new features, Limited to 25 clients",
    visibility: "Private",
    status: "Inactive",
  },
]

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(mockPlans)
  const [showModal, setShowModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [newPlan, setNewPlan] = useState({
    name: "",
    monthlyPrice: 0,
    features: "",
    visibility: "Public" as const,
  })

  const handleCreatePlan = () => {
    if (newPlan.name && newPlan.monthlyPrice > 0) {
      const plan: Plan = {
        id: String(Date.now()),
        ...newPlan,
        status: "Active",
      }
      setPlans([...plans, plan])
      setNewPlan({ name: "", monthlyPrice: 0, features: "", visibility: "Public" })
      setShowModal(false)
    }
  }

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-poppins text-foreground mb-2">Plans & Pricing</h1>
        <p className="text-muted-foreground">Create and manage subscription plans</p>
      </div>

      {/* Plans Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold font-poppins text-foreground">Subscription Plans</h2>
          <button
            onClick={() => {
              setEditingPlan(null)
              setNewPlan({ name: "", monthlyPrice: 0, features: "", visibility: "Public" })
              setShowModal(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Create Plan
          </button>
        </div>

        <DataTable<Plan>
          columns={[
            {
              key: "name",
              label: "Plan Name",
              sortable: true,
            },
            {
              key: "monthlyPrice",
              label: "Monthly Price",
              sortable: true,
              render: (price) => `$${price}/mo`,
            },
            {
              key: "features",
              label: "Features",
              render: (features) => <div className="max-w-xs truncate text-muted-foreground text-sm">{features}</div>,
            },
            {
              key: "visibility",
              label: "Visibility",
              sortable: true,
              render: (visibility) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    visibility === "Public" ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {visibility}
                </span>
              ),
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
                  <button className="p-1 hover:bg-border rounded transition-colors" title="Preview">
                    <Eye size={16} className="text-primary" />
                  </button>
                  <button className="p-1 hover:bg-border rounded transition-colors" title="Edit">
                    <Edit2 size={16} className="text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(id)}
                    className="p-1 hover:bg-border rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </button>
                </div>
              ),
            },
          ]}
          data={plans}
        />
      </div>

      {/* Create/Edit Plan Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Create Plan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Plan Name</label>
              <input
                type="text"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                placeholder="e.g., Professional"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Monthly Price ($)</label>
              <input
                type="number"
                value={newPlan.monthlyPrice}
                onChange={(e) => setNewPlan({ ...newPlan, monthlyPrice: Number.parseInt(e.target.value) })}
                placeholder="0"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Features</label>
            <textarea
              value={newPlan.features}
              onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
              placeholder="e.g., Up to 50 clients, Advanced analytics, Priority support"
              rows={4}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-secondary focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Visibility</label>
              <select
                value={newPlan.visibility}
                onChange={(e) => setNewPlan({ ...newPlan, visibility: e.target.value as "Public" | "Private" })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
          </div>
          </div>

          <DialogFooter className="flex gap-3">
            <button onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreatePlan} className="btn-primary">
              {editingPlan ? "Update Plan" : "Create Plan"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
