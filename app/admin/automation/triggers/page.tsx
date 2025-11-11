"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table"

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
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Triggers & Events</h1>
            <p className="text-muted-foreground">Define conditions and actions for automation</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Trigger
          </Button>
        </div>

        {/* Triggers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trigger Name</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Linked Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {triggers.map((trigger) => (
                  <TableRow key={trigger.id}>
                    <TableCell>{trigger.name}</TableCell>
                    <TableCell>{trigger.eventType}</TableCell>
                    <TableCell>{trigger.condition}</TableCell>
                    <TableCell>{trigger.linkedAction}</TableCell>
                    <TableCell>
                      <Badge variant={trigger.status === "Active" ? "default" : "secondary"}>
                        {trigger.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Test">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete">
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

        {/* Create Trigger Dialog */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Trigger</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-2">Trigger Name</Label>
                <Input
                  type="text"
                  value={newTrigger.name}
                  onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })}
                  placeholder="e.g., Inactivity Alert"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Event Type</Label>
                <Select
                  value={newTrigger.eventType}
                  onValueChange={(value) => setNewTrigger({ ...newTrigger, eventType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client Inactivity">Client Inactivity</SelectItem>
                    <SelectItem value="Subscription Renewal">Subscription Renewal</SelectItem>
                    <SelectItem value="Performance Anomaly">Performance Anomaly</SelectItem>
                    <SelectItem value="Payment Error">Payment Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Condition</Label>
                <Input
                  type="text"
                  value={newTrigger.condition}
                  onChange={(e) => setNewTrigger({ ...newTrigger, condition: e.target.value })}
                  placeholder="e.g., No login for 7 days"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Linked Action</Label>
                <Input
                  type="text"
                  value={newTrigger.linkedAction}
                  onChange={(e) => setNewTrigger({ ...newTrigger, linkedAction: e.target.value })}
                  placeholder="e.g., Send WhatsApp reminder"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTrigger}>
                Create Trigger
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}