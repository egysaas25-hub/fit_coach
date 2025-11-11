"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Copy, Trash2, Search, FileUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table"

interface WorkflowLibrary {
  id: string
  name: string
  description: string
  category: "Onboarding" | "Renewals" | "Follow-ups"
  status: "Active" | "Inactive"
  steps: number
}

const mockWorkflows: WorkflowLibrary[] = [
  {
    id: "1",
    name: "Client Onboarding",
    description: "Automated sequence for new client setup and introduction",
    category: "Onboarding",
    status: "Active",
    steps: 5,
  },
  {
    id: "2",
    name: "Welcome Series",
    description: "Send welcome message and resources",
    category: "Onboarding",
    status: "Active",
    steps: 3,
  },
  {
    id: "3",
    name: "Renewal Reminder",
    description: "30 days before renewal notification",
    category: "Renewals",
    status: "Active",
    steps: 2,
  },
  {
    id: "4",
    name: "Weekly Follow-up",
    description: "Weekly check-in messages",
    category: "Follow-ups",
    status: "Active",
    steps: 1,
  },
  {
    id: "5",
    name: "Re-engagement Series",
    description: "Win back inactive clients",
    category: "Follow-ups",
    status: "Inactive",
    steps: 4,
  },
]

export default function WorkflowLibraryPage() {
  const [workflows, setWorkflows] = useState<WorkflowLibrary[]>(mockWorkflows)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const filteredWorkflows = workflows.filter(
    (w) =>
      (selectedCategory === "All" || w.category === selectedCategory) &&
      (w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDuplicate = (id: string) => {
    const workflow = workflows.find((w) => w.id === id)
    if (workflow) {
      const newWorkflow: WorkflowLibrary = {
        ...workflow,
        id: String(Date.now()),
        name: `${workflow.name} (Copy)`,
      }
      setWorkflows([newWorkflow, ...workflows])
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Workflow Library</h1>
            <p className="text-muted-foreground">Browse and activate pre-built workflows</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search workflows..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Onboarding">Onboarding</SelectItem>
                  <SelectItem value="Renewals">Renewals</SelectItem>
                  <SelectItem value="Follow-ups">Follow-ups</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button>
                <FileUp className="mr-2 h-4 w-4" />
                Import Workflow
              </Button>
              <Button variant="secondary">Export Selected</Button>
            </div>
          </CardContent>
        </Card>

        {/* Workflows Table */}
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Steps</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell>{workflow.name}</TableCell>
                    <TableCell>{workflow.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{workflow.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={workflow.status === "Active" ? "default" : "secondary"}>
                        {workflow.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{workflow.steps}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Activate">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Duplicate" onClick={() => handleDuplicate(workflow.id)}>
                          <Copy className="h-4 w-4" />
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
      </main>
    </div>
  )
}