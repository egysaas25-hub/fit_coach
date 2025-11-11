"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Plus, Play, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table"

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
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">AI Alerts Configuration</h1>
            <p className="text-muted-foreground">Setup AI-driven WhatsApp alerts for your clients</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 bg-primary/10 border-primary/30">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle size={20} className="text-primary flex-shrink-0" />
            <p className="text-sm text-primary">WhatsApp integration is active. All alerts will be sent via WhatsApp.</p>
          </CardContent>
        </Card>

        {/* Alerts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert Type</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Message Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Badge variant="secondary">{alert.type}</Badge>
                    </TableCell>
                    <TableCell>{alert.threshold}</TableCell>
                    <TableCell>{alert.channel}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground text-sm">{alert.messageTemplate}</TableCell>
                    <TableCell>
                      <Badge variant={alert.status === "Active" ? "default" : "secondary"}>
                        {alert.status}
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

        {/* Create Alert Dialog */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create AI Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-2">Alert Type</Label>
                <Select
                  value={newAlert.type}
                  onValueChange={(value) => setNewAlert({ ...newAlert, type: value as "Inactivity" | "Renewal" | "Anomaly" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inactivity">Inactivity</SelectItem>
                    <SelectItem value="Renewal">Renewal</SelectItem>
                    <SelectItem value="Anomaly">Anomaly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Threshold</Label>
                <Input
                  type="text"
                  value={newAlert.threshold}
                  onChange={(e) => setNewAlert({ ...newAlert, threshold: e.target.value })}
                  placeholder="e.g., No login for 7 days"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Message Template</Label>
                <Textarea
                  value={newAlert.messageTemplate}
                  onChange={(e) => setNewAlert({ ...newAlert, messageTemplate: e.target.value })}
                  placeholder="e.g., Hi {{name}}, we noticed..."
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAlert}>
                Create Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}