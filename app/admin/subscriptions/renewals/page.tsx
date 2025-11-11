"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table"

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

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Renewal Automation</h1>
            <p className="text-muted-foreground">Setup renewal reminders and payment retry workflows</p>
          </div>
        </div>

        {/* Configuration Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Global Renewal Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium mb-2">Reminder Days Before Renewal</Label>
                <Input
                  type="number"
                  value={config.reminderDays}
                  onChange={(e) => setConfig({ ...config, reminderDays: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-2">Channel</Label>
                <Select value={config.channel} onValueChange={(value) => setConfig({ ...config, channel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="WhatsApp + Email">WhatsApp + Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <Label className="block text-sm font-medium mb-2">Message Template</Label>
              <Textarea
                value={config.messageTemplate}
                onChange={(e) => setConfig({ ...config, messageTemplate: e.target.value })}
                rows={3}
              />
            </div>

            <div className="mt-4">
              <Label className="block text-sm font-medium mb-2">Retry Attempts on Payment Failure</Label>
              <Input
                type="number"
                value={config.retryAttempts}
                onChange={(e) => setConfig({ ...config, retryAttempts: Number(e.target.value) })}
                min="1"
                max="5"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button>Save Configuration</Button>
              <Button variant="secondary">
                <Play className="mr-2 h-4 w-4" />
                Test Workflow
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Renewals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Renewals</CardTitle>
              <Button onClick={() => setShowModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Renewal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Reminder (Days Before)</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renewals.map((renewal) => (
                  <TableRow key={renewal.id}>
                    <TableCell>{renewal.client}</TableCell>
                    <TableCell>{renewal.subscriptionPlan}</TableCell>
                    <TableCell>{renewal.dueDate}</TableCell>
                    <TableCell>{renewal.reminderDaysBefore}</TableCell>
                    <TableCell>{renewal.channel}</TableCell>
                    <TableCell>
                      <Badge variant={renewal.status === "Active" ? "default" : "secondary"}>
                        {renewal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Trigger">
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

        {/* Placeholder for Add Renewal Dialog */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Renewal</DialogTitle>
            </DialogHeader>
            {/* Add form fields here */}
            <DialogFooter>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}