"use client"

import { useState } from "react"
import DataTable from "@/components/workspace/data-table"
import { Plus, Edit2, Copy, Trash2, Search, FileUp } from "lucide-react"

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-poppins text-foreground mb-2">Workflow Library</h1>
        <p className="text-muted-foreground">Browse and activate pre-built workflows</p>
      </div>

      {/* Filters and Actions */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
          >
            <option>All</option>
            <option>Onboarding</option>
            <option>Renewals</option>
            <option>Follow-ups</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button className="btn-primary flex items-center gap-2">
            <FileUp size={16} />
            Import Workflow
          </button>
          <button className="btn-secondary flex items-center gap-2">Export Selected</button>
        </div>
      </div>

      {/* Workflows Table */}
      <div className="card">
        <DataTable<WorkflowLibrary>
          columns={[
            {
              key: "name",
              label: "Workflow Name",
              sortable: true,
            },
            {
              key: "description",
              label: "Description",
            },
            {
              key: "category",
              label: "Category",
              sortable: true,
              render: (cat) => (
                <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-semibold">{cat}</span>
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
              key: "steps",
              label: "Steps",
              sortable: true,
            },
            {
              key: "id",
              label: "Actions",
              render: (id) => (
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-border rounded transition-colors" title="Activate">
                    <Plus size={16} className="text-primary" />
                  </button>
                  <button className="p-1 hover:bg-border rounded transition-colors" title="Edit">
                    <Edit2 size={16} className="text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(id)}
                    className="p-1 hover:bg-border rounded transition-colors"
                    title="Duplicate"
                  >
                    <Copy size={16} className="text-muted-foreground hover:text-foreground" />
                  </button>
                  <button className="p-1 hover:bg-border rounded transition-colors" title="Delete">
                    <Trash2 size={16} className="text-destructive" />
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredWorkflows}
        />
      </div>
    </div>
  )
}
