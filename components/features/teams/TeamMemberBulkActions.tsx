"use client"

import { UserX, Download } from "lucide-react"
import { BulkActionBar } from "@/components/shared/actions/BulkActionBar"
import { BulkDeleteConfirmDialog } from "@/components/shared/dialogs/BulkDeleteConfirmDialog"
import { useBulkDelete } from "@/lib/hooks/useBulkDelete"
import { useBulkExport } from "@/lib/hooks/useBulkExport"

interface TeamMemberBulkActionsProps {
  selectedIds: string[]
  selectedCount: number
  onClearSelection: () => void
  onDeleteSuccess: () => void
}

/**
 * Bulk actions component for team member management
 * Provides bulk deactivation and export functionality
 */
export function TeamMemberBulkActions({
  selectedIds,
  selectedCount,
  onClearSelection,
  onDeleteSuccess,
}: TeamMemberBulkActionsProps) {
  const {
    isLoading,
    isDialogOpen,
    selectedCount: deleteCount,
    openDialog,
    closeDialog,
    executeBulkDelete,
  } = useBulkDelete({
    endpoint: '/api/teams/members/bulk-delete',
    entityName: 'team member',
    onSuccess: () => {
      onDeleteSuccess()
      onClearSelection()
    },
  })

  const { isLoading: isExporting, executeBulkExport } = useBulkExport({
    endpoint: '/api/teams/members/bulk-export',
    entityName: 'team member',
    format: 'csv',
  })

  const handleBulkDeactivate = () => {
    openDialog(selectedIds)
  }

  const handleBulkExport = async () => {
    await executeBulkExport(selectedIds)
  }

  const actions = [
    {
      label: 'Deactivate',
      onClick: handleBulkDeactivate,
      icon: <UserX className="h-4 w-4" />,
      variant: 'destructive' as const,
      disabled: isLoading,
    },
    {
      label: 'Export',
      onClick: handleBulkExport,
      icon: <Download className="h-4 w-4" />,
      variant: 'outline' as const,
      disabled: isExporting,
    },
  ]

  return (
    <>
      <BulkActionBar
        selectedCount={selectedCount}
        actions={actions}
        onClearSelection={onClearSelection}
      />

      <BulkDeleteConfirmDialog
        open={isDialogOpen}
        onOpenChange={closeDialog}
        onConfirm={executeBulkDelete}
        selectedCount={deleteCount}
        entityName="team member"
        isLoading={isLoading}
        title={`Deactivate ${deleteCount} team member${deleteCount !== 1 ? 's' : ''}?`}
        description={`This will deactivate ${deleteCount} team member${deleteCount !== 1 ? 's' : ''}. They will no longer be able to access the system. You can reactivate them later if needed.`}
      />
    </>
  )
}
