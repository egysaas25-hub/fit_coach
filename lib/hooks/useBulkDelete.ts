import { useState } from 'react';
import { toast } from 'sonner';

interface UseBulkDeleteOptions {
  endpoint: string;
  entityName?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for handling bulk delete operations
 * Provides loading state, error handling, and success notifications
 */
export function useBulkDelete({
  endpoint,
  entityName = 'item',
  onSuccess,
  onError,
}: UseBulkDeleteOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const openDialog = (ids: string[]) => {
    setPendingIds(ids);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setPendingIds([]);
  };

  const executeBulkDelete = async () => {
    if (pendingIds.length === 0) return;

    setIsLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: pendingIds }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to delete items');
      }

      // Show success message
      toast.success(
        data.message || `Successfully deleted ${data.count} ${data.count === 1 ? entityName : `${entityName}s`}`
      );

      // Close dialog and reset state
      closeDialog();

      // Call success callback
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isDialogOpen,
    selectedCount: pendingIds.length,
    openDialog,
    closeDialog,
    executeBulkDelete,
  };
}
