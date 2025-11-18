'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'

import { AdminLayout } from '@/components/layouts/AdminLayout'
import { DataTable } from '@/components/shared/data-display/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Users } from 'lucide-react'
import { AddMemberModal } from '@/components/features/teams/AddMemberModal'

interface TeamMember {
  id: string
  full_name: string
  email: string
  phone_e164: string
  role: string
  max_caseload: number | null
  assigned_clients: number
  workload_index: number
  avg_response_time_seconds: number | null
  active: boolean
  created_at: Date
}

export default function TeamMembersPage() {
  const router = useRouter()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Fetch team members
  const { data, isLoading, refetch } = useQuery<{
    members: TeamMember[]
    total: number
  }>({
    queryKey: ['team-members'],
    queryFn: async () => {
      const response = await fetch('/api/teams/members', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch team members')
      }

      return response.json()
    },
  })

  const roleLabels: Record<string, string> = {
    admin: 'Admin',
    superior_trainer: 'Superior Trainer',
    senior_trainer: 'Senior Trainer',
    junior_trainer: 'Junior Trainer',
    sales: 'Sales',
    support: 'Support',
    finance: 'Finance',
  }

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-500/10 text-purple-500',
    superior_trainer: 'bg-blue-500/10 text-blue-500',
    senior_trainer: 'bg-green-500/10 text-green-500',
    junior_trainer: 'bg-yellow-500/10 text-yellow-500',
    sales: 'bg-orange-500/10 text-orange-500',
    support: 'bg-pink-500/10 text-pink-500',
    finance: 'bg-indigo-500/10 text-indigo-500',
  }

  const getWorkloadColor = (index: number) => {
    if (index >= 90) return 'text-red-600'
    if (index >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: 'full_name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.full_name}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.original.email}</div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant="outline" className={roleColors[row.original.role]}>
          {roleLabels[row.original.role]}
        </Badge>
      ),
    },
    {
      accessorKey: 'assigned_clients',
      header: 'Assigned Clients',
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.assigned_clients}
          {row.original.max_caseload && (
            <span className="text-muted-foreground"> / {row.original.max_caseload}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'workload_index',
      header: 'Workload',
      cell: ({ row }) => {
        const index = row.original.workload_index
        return (
          <div className="flex items-center gap-2">
            <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
              <div
                className={`h-2 rounded-full ${
                  index >= 90 ? 'bg-red-500' : index >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(index, 100)}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${getWorkloadColor(index)}`}>
              {index}%
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'avg_response_time_seconds',
      header: 'Avg Response',
      cell: ({ row }) => {
        const seconds = row.original.avg_response_time_seconds
        if (!seconds) return <span className="text-muted-foreground">-</span>
        
        const minutes = Math.floor(seconds / 60)
        if (minutes < 1) return <span className="text-green-600">&lt;1 min</span>
        if (minutes < 5) return <span className="text-green-600">{minutes} min</span>
        if (minutes < 15) return <span className="text-yellow-600">{minutes} min</span>
        return <span className="text-red-600">{minutes} min</span>
      },
    },
    {
      accessorKey: 'active',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.active ? 'default' : 'secondary'}>
          {row.original.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Members</h1>
            <p className="text-muted-foreground">
              Manage your team members, roles, and workload
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Summary Cards */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">Total Members</span>
              </div>
              <div className="text-2xl font-bold">{data.total}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">Active</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {data.members.filter(m => m.active).length}
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">Trainers</span>
              </div>
              <div className="text-2xl font-bold">
                {data.members.filter(m => 
                  ['superior_trainer', 'senior_trainer', 'junior_trainer'].includes(m.role)
                ).length}
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">Avg Workload</span>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(
                  data.members.reduce((sum, m) => sum + m.workload_index, 0) / data.members.length
                )}%
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={data?.members || []}
          isLoading={isLoading}
          onRowClick={(member) => router.push(`/admin/teams/members/${member.id}`)}
          searchPlaceholder="Search by name or email..."
          searchKey="full_name"
        />
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => {
          refetch()
          setIsAddModalOpen(false)
        }}
      />
    </AdminLayout>
  )
}
