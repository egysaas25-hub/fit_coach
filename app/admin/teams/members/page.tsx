'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import AdminLayout from '@/components/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { UserPlus, Users, FileSpreadsheet } from 'lucide-react'
import { AddMemberModal } from '@/components/features/teams/AddMemberModal'
import { TeamMemberBulkActions } from '@/components/features/teams/TeamMemberBulkActions'
import { useBulkSelection } from '@/lib/hooks/useBulkSelection'
import { toast } from 'sonner'
import { format } from 'date-fns'

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

  // Bulk selection
  const {
    isAllSelected,
    isIndeterminate,
    toggleAll,
    toggleItem,
    isSelected,
    selectedItems,
    deselectAll,
  } = useBulkSelection(data?.members || [])

  // Toggle member active status
  const handleToggleActive = async (memberId: string, currentStatus: boolean) => {
    try {
      toast.loading('Updating status...')
      
      const response = await fetch(`/api/teams/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          active: !currentStatus,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to update status')
      }

      toast.dismiss()
      toast.success(`Member ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      
      // Refresh the list
      refetch()
    } catch (error) {
      toast.dismiss()
      toast.error(error instanceof Error ? error.message : 'Failed to update status')
      console.error('Toggle error:', error)
    }
  }

  // Export team members to CSV
  const handleExportCSV = async () => {
    try {
      if (!data?.members.length) return
      
      toast.loading('Preparing export...')
      
      // CSV headers
      const headers = [
        'Name',
        'Email',
        'Phone',
        'Role',
        'Assigned Clients',
        'Max Caseload',
        'Workload %',
        'Avg Response Time (min)',
        'Status',
        'Created Date',
      ]
      
      // CSV rows
      const rows = data.members.map(member => [
        member.full_name,
        member.email,
        member.phone_e164 || '',
        roleLabels[member.role] || member.role,
        member.assigned_clients.toString(),
        member.max_caseload?.toString() || 'N/A',
        `${member.workload_index}%`,
        member.avg_response_time_seconds 
          ? Math.floor(member.avg_response_time_seconds / 60).toString()
          : 'N/A',
        member.active ? 'Active' : 'Inactive',
        format(new Date(member.created_at), 'yyyy-MM-dd HH:mm:ss'),
      ])
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `team-members-export-${format(new Date(), 'yyyy-MM-dd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.dismiss()
      toast.success(`Exported ${data.members.length} team members to CSV`)
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to export team members')
      console.error('Export error:', error)
    }
  }

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
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={isLoading || !data?.members.length}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
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
        <div className="bg-card border rounded-lg p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={toggleAll}
                        aria-label="Select all"
                        className={isIndeterminate ? "data-[state=checked]:bg-primary/50" : ""}
                      />
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Assigned Clients</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Workload</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Avg Response</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.members.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => router.push(`/admin/teams/members/${member.id}`)}
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected(member.id)}
                          onCheckedChange={() => toggleItem(member.id)}
                          aria-label={`Select ${member.full_name}`}
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{member.full_name}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={roleColors[member.role]}>
                          {roleLabels[member.role]}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        {member.assigned_clients}
                        {member.max_caseload && (
                          <span className="text-muted-foreground"> / {member.max_caseload}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
                            <div
                              className={`h-2 rounded-full ${
                                member.workload_index >= 90 ? 'bg-red-500' : member.workload_index >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(member.workload_index, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${getWorkloadColor(member.workload_index)}`}>
                            {member.workload_index}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {(() => {
                          const seconds = member.avg_response_time_seconds
                          if (!seconds) return <span className="text-muted-foreground">-</span>
                          
                          const minutes = Math.floor(seconds / 60)
                          if (minutes < 1) return <span className="text-green-600">&lt;1 min</span>
                          if (minutes < 5) return <span className="text-green-600">{minutes} min</span>
                          if (minutes < 15) return <span className="text-yellow-600">{minutes} min</span>
                          return <span className="text-red-600">{minutes} min</span>
                        })()}
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={member.active}
                            onCheckedChange={() => handleToggleActive(member.id, member.active)}
                          />
                          <Badge variant={member.active ? 'default' : 'secondary'}>
                            {member.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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

      {/* Bulk Actions */}
      <TeamMemberBulkActions
        selectedIds={selectedItems.map(item => item.id)}
        selectedCount={selectedItems.length}
        onClearSelection={deselectAll}
        onDeleteSuccess={() => {
          refetch()
          deselectAll()
        }}
      />
    </AdminLayout>
  )
}
