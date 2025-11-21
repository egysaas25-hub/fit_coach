"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Filter, FileSpreadsheet } from "lucide-react"
import { toast } from "sonner"
import { AddClientModal } from "@/components/features/clients/AddClientModal"
import { ClientBulkActions } from "@/components/features/clients/ClientBulkActions"
import { useBulkSelection } from "@/lib/hooks/useBulkSelection"

// Client type from API
interface Client {
  id: string
  client_code: string
  first_name: string
  last_name: string
  full_name: string
  phone_e164: string
  status: 'lead' | 'active' | 'expired' | 'churned'
  goal: string | null
  source: string
  assigned_trainer: {
    id: string
    name: string
  } | null
  active_subscription: any | null
  created_at: Date
  updated_at: Date
}

interface ClientsResponse {
  rows: Client[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
    lead: { label: 'Lead', className: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
    expired: { label: 'Expired', className: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' },
    churned: { label: 'Churned', className: 'bg-red-500/10 text-red-500 hover:bg-red-500/20' },
  }
  
  const variant = variants[status] || variants.lead
  
  return (
    <Badge variant="outline" className={variant.className}>
      {variant.label}
    </Badge>
  )
}

export default function ClientsPage() {
  const router = useRouter()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 50

  // Fetch clients from API
  const { data, isLoading, error, refetch } = useQuery<ClientsResponse>({
    queryKey: ['clients', page, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      })

      const response = await fetch(`/api/clients?${params}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch clients')
      }

      return response.json()
    },
  })

  // Bulk selection
  const {
    isAllSelected,
    isIndeterminate,
    toggleAll,
    toggleItem,
    isSelected,
    selectedItems,
    deselectAll,
  } = useBulkSelection(data?.rows || [])

  // Handle row click
  const handleRowClick = (client: Client) => {
    router.push(`/admin/clients/${client.id}`)
  }

  // Handle export to CSV
  const handleExportCSV = async () => {
    try {
      toast.loading('Preparing export...')
      
      // Fetch all clients with current filters (no pagination)
      const params = new URLSearchParams({
        pageSize: '10000', // Get all matching records
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      })

      const response = await fetch(`/api/clients?${params}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch clients for export')
      }

      const exportData: ClientsResponse = await response.json()
      
      // Convert to CSV
      const headers = [
        'Client Code',
        'First Name',
        'Last Name',
        'Phone',
        'Email',
        'Status',
        'Goal',
        'Source',
        'Trainer',
        'Created Date',
      ]
      
      const rows = exportData.rows.map(client => [
        client.client_code,
        client.first_name,
        client.last_name,
        client.phone_e164,
        '', // Email not in current data model
        client.status,
        client.goal || '',
        client.source,
        client.assigned_trainer?.name || 'Unassigned',
        format(new Date(client.created_at), 'yyyy-MM-dd HH:mm:ss'),
      ])
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `clients-export-${format(new Date(), 'yyyy-MM-dd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.dismiss()
      toast.success(`Exported ${exportData.rows.length} clients to CSV`)
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to export clients')
      console.error('Export error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client database and relationships
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={isLoading || !data?.rows.length}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-2xl font-bold">{data.total}</div>
            <div className="text-sm text-muted-foreground">Total Clients</div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="churned">Churned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(search || statusFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setStatusFilter('')
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">Failed to load clients</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Select all"
                      className={isIndeterminate ? "data-[state=checked]:bg-primary/50" : ""}
                    />
                  </TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.rows.map((client) => (
                  <TableRow
                    key={client.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(client)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected(client.id)}
                        onCheckedChange={() => toggleItem(client.id)}
                        aria-label={`Select ${client.full_name}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono font-semibold">
                      {client.client_code}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {client.phone_e164}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={client.status} />
                    </TableCell>
                    <TableCell>{client.goal || '—'}</TableCell>
                    <TableCell>
                      {client.assigned_trainer?.name || 'Unassigned'}
                    </TableCell>
                    <TableCell className="capitalize">{client.source}</TableCell>
                    <TableCell>
                      {format(new Date(client.created_at), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((page - 1) * pageSize) + 1} to{' '}
                  {Math.min(page * pageSize, data.total)} of {data.total} results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= data.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Add Client Modal */}
      <AddClientModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => refetch()}
      />

      {/* Bulk Actions */}
      <ClientBulkActions
        selectedIds={selectedItems.map(item => item.id)}
        selectedCount={selectedItems.length}
        onClearSelection={deselectAll}
        onDeleteSuccess={() => {
          refetch()
          deselectAll()
        }}
      />
    </div>
  )
}
