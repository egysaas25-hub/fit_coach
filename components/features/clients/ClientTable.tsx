"use client"

import { DataTable, Column, Action } from "@/components/shared/data-display/DataTable"
import { Badge } from "@/components/ui/badge"
import { Eye, MessageSquare, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

export interface Client {
  id: string
  clientCode: string
  name: string
  phone: string
  status: "active" | "inactive" | "lead" | "expired"
  trainer: string
  plan: string
  goal: string
  round: string
  renewalDate: Date
  lastContact: Date
  unreadMessages: number
}

interface ClientTableProps {
  clients: Client[]
  onViewClient: (client: Client) => void
  onMessageClient: (client: Client) => void
  onEditClient: (client: Client) => void
  onDeleteClient: (client: Client) => void
}

const statusColors = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  lead: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  expired: "bg-orange-500/10 text-orange-500 border-orange-500/20",
}

export function ClientTable({
  clients,
  onViewClient,
  onMessageClient,
  onEditClient,
  onDeleteClient,
}: ClientTableProps) {
  const columns: Column<Client>[] = [
    {
      key: "clientCode",
      label: "Code",
      sortable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: keyof typeof statusColors) => (
        <Badge variant="outline" className={statusColors[value]}>
          {value}
        </Badge>
      ),
    },
    {
      key: "trainer",
      label: "Trainer",
      sortable: true,
    },
    {
      key: "plan",
      label: "Plan",
      render: (value) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      ),
    },
    {
      key: "goal",
      label: "Goal",
      render: (value) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      ),
    },
    {
      key: "round",
      label: "Round",
      render: (value) => (
        <Badge variant="secondary" className="font-mono text-xs">
          {value}
        </Badge>
      ),
    },
    {
      key: "renewalDate",
      label: "Renewal",
      sortable: true,
      render: (value: Date) => (
        <span className="text-sm">{format(value, "MMM d, yyyy")}</span>
      ),
    },
    {
      key: "unreadMessages",
      label: "Messages",
      render: (value: number) =>
        value > 0 ? (
          <Badge variant="default" className="h-5 min-w-[20px]">
            {value}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ]

  const actions: Action<Client>[] = [
    {
      label: "View Profile",
      onClick: onViewClient,
      icon: <Eye className="h-4 w-4 mr-2" />,
    },
    {
      label: "Send Message",
      onClick: onMessageClient,
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
    {
      label: "Edit",
      onClick: onEditClient,
      icon: <Edit className="h-4 w-4 mr-2" />,
    },
    {
      label: "Delete",
      onClick: onDeleteClient,
      icon: <Trash2 className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <DataTable
      data={clients}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search clients by name, code, or phone..."
      onRowClick={onViewClient}
      emptyMessage="No clients found"
    />
  )
}
