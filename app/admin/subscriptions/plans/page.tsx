"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Eye, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table"

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
    visibility: "Public" as "Public" | "Private",
  })

  const handleSavePlan = () => {
    if (newPlan.name && newPlan.monthlyPrice > 0) {
      if (editingPlan) {
        setPlans(plans.map((p) => (p.id === editingPlan.id ? { ...p, ...newPlan } : p)))
      } else {
        const plan: Plan = {
          id: String(Date.now()),
          ...newPlan,
          status: "Active",
        }
        setPlans([...plans, plan])
      }
      setNewPlan({ name: "", monthlyPrice: 0, features: "", visibility: "Public" })
      setEditingPlan(null)
      setShowModal(false)
    }
  }

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter((p) => p.id !== id))
  }

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setNewPlan({
      name: plan.name,
      monthlyPrice: plan.monthlyPrice,
      features: plan.features,
      visibility: plan.visibility,
    })
    setShowModal(true)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Plans & Pricing</h1>
            <p className="text-muted-foreground">Create and manage subscription plans</p>
          </div>
          <Button
            onClick={() => {
              setEditingPlan(null)
              setNewPlan({ name: "", monthlyPrice: 0, features: "", visibility: "Public" })
              setShowModal(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        </div>

        {/* Plans Table */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Monthly Price</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>${plan.monthlyPrice}/mo</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground text-sm">{plan.features}</TableCell>
                    <TableCell>
                      <Badge variant={plan.visibility === "Public" ? "default" : "secondary"}>
                        {plan.visibility}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.status === "Active" ? "default" : "secondary"}>
                        {plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeletePlan(plan.id)}>
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

        {/* Create/Edit Plan Dialog */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Edit Plan" : "Create Plan"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium mb-2">Plan Name</Label>
                  <Input
                    type="text"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    placeholder="e.g., Professional"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-2">Monthly Price ($)</Label>
                  <Input
                    type="number"
                    value={newPlan.monthlyPrice}
                    onChange={(e) => setNewPlan({ ...newPlan, monthlyPrice: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Features</Label>
                <Textarea
                  value={newPlan.features}
                  onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                  placeholder="e.g., Up to 50 clients, Advanced analytics, Priority support"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium mb-2">Visibility</Label>
                  <Select
                    value={newPlan.visibility}
                    onValueChange={(value) => setNewPlan({ ...newPlan, visibility: value as "Public" | "Private" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePlan}>
                {editingPlan ? "Update Plan" : "Create Plan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}