"use client"

import { Trash2, Download } from "lucide-react"
import { BulkActionBar } from "@/components/shared/actions/BulkActionBar"
import { BulkDeleteConfirmDialog } from "@/components/shared/dialogs/BulkDeleteConfirmDialog"
import { useBulkDelete } from "@/lib/hooks/useBulkDelete"
import { useBulkExport } from "@/lib/hooks/useBulkExport"

interface ClientBulkActionsProps {
  selectedIds: string[]
  selectedCount: number
  onClearSelection: () => void
  onDeleteSuccess: () => void
}

/**
 * Bulk actions component for client management
 * Provides bulk delete and export functionality
 */
export function ClientBulkActions({
  selectedIds,
  selectedCount,
  onClearSelection,
  onDeleteSuccess,
}: ClientBulkActionsProps) {
  const {
    isLoading,
    isDialogOpen,
    selectedCount: deleteCount,
    openDialog,
    closeDialog,
    executeBulkDelete,
  } = useBulkDelete({
    endpoint: '/api/clients/bulk-delete',
    entityName: 'client',
    onSuccess: () => {
      onDeleteSuccess()
      onClearSelection()
    },
  })

  const { isLoading: isExporting, executeBulkExport } = useBulkExport({
    endpoint: '/api/clients/bulk-export',
    entityName: 'client',
    format: 'csv',
  })

  const handleBulkDelete = () => {
    openDialog(selectedIds)
  }

  const handleBulkExport = async () => {
    await executeBulkExport(selectedIds)
  }

  const actions = [
    {
      label: 'Delete',
      onClick: handleBulkDelete,
      icon: <Trash2 className="h-4 w-4" />,
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
        entityName="client"
        isLoading={isLoading}
        description={`This will mark ${deleteCount} client${deleteCount !== 1 ? 's' : ''} as churned. This action can be reversed by updating the client status.`}
      />
    </>
  )
}
