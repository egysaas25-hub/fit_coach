/**
 * Integration tests for complete bulk operations flow
 * Tests the interaction between selection, delete, export, and progress indicators
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useBulkSelection } from '@/lib/hooks/useBulkSelection'
import { useBulkDelete } from '@/lib/hooks/useBulkDelete'
import { useBulkExport } from '@/lib/hooks/useBulkExport'
import { toast } from 'sonner'

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock fetch
global.fetch = jest.fn()

// Mock URL and document for export tests
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = jest.fn()
document.createElement = jest.fn().mockReturnValue({
  href: '',
  download: '',
  style: { display: '' },
  click: jest.fn(),
}) as any
document.body.appendChild = jest.fn()
document.body.removeChild = jest.fn()

describe('Bulk Operations Integration Flow', () => {
  const mockClients = [
    { id: '1', name: 'Client 1' },
    { id: '2', name: 'Client 2' },
    { id: '3', name: 'Client 3' },
    { id: '4', name: 'Client 4' },
    { id: '5', name: 'Client 5' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  describe('Complete Selection and Delete Flow', () => {
    it('should select items, open delete dialog, and execute delete', async () => {
      // Setup selection hook
      const { result: selectionResult } = renderHook(() =>
        useBulkSelection(mockClients)
      )

      // Setup delete hook
      const onSuccess = jest.fn()
      const { result: deleteResult } = renderHook(() =>
        useBulkDelete({
          endpoint: '/api/clients/bulk-delete',
          entityName: 'client',
          onSuccess,
        })
      )

      // Step 1: Select multiple items
      act(() => {
        selectionResult.current.toggleItem('1')
        selectionResult.current.toggleItem('3')
        selectionResult.current.toggleItem('5')
      })

      expect(selectionResult.current.selectedCount).toBe(3)
      expect(selectionResult.current.selectedIds).toEqual(['1', '3', '5'])

      // Step 2: Open delete dialog with selected IDs
      act(() => {
        deleteResult.current.openDialog(selectionResult.current.selectedIds)
      })

      expect(deleteResult.current.isDialogOpen).toBe(true)
      expect(deleteResult.current.selectedCount).toBe(3)

      // Step 3: Mock successful delete response
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Successfully deleted 3 clients',
          count: 3,
        }),
      })

      // Step 4: Execute delete
      await act(async () => {
        await deleteResult.current.executeBulkDelete()
      })

      // Step 5: Verify delete was successful
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/clients/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: ['1', '3', '5'] }),
        })
        expect(toast.success).toHaveBeenCalledWith('Successfully deleted 3 clients')
        expect(deleteResult.current.isDialogOpen).toBe(false)
        expect(onSuccess).toHaveBeenCalled()
      })

      // Step 6: Clear selection after successful delete
      act(() => {
        selectionResult.current.deselectAll()
      })

      expect(selectionResult.current.selectedCount).toBe(0)
    })

    it('should show loading state during delete operation', async () => {
      const { result: selectionResult } = renderHook(() =>
        useBulkSelection(mockClients)
      )

      const { result: deleteResult } = renderHook(() =>
        useBulkDelete({
          endpoint: '/api/clients/bulk-delete',
          entityName: 'client',
        })
      )

      // Select items
      act(() => {
        selectionResult.current.selectAll()
      })

      // Open dialog
      act(() => {
        deleteResult.current.openDialog(selectionResult.current.selectedIds)
      })

      // Mock delayed response to test loading state
      ;(global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true, count: 5 }),
                }),
              100
            )
          )
      )

      // Execute delete
      act(() => {
        deleteResult.current.executeBulkDelete()
      })

      // Verify loading state is true
      expect(deleteResult.current.isLoading).toBe(true)

      // Wait for completion
      await waitFor(() => {
        expect(deleteResult.current.isLoading).toBe(false)
      })
    })
  })

  describe('Complete Selection and Export Flow', () => {
    it('should select items and execute export with progress', async () => {
      // Setup selection hook
      const { result: selectionResult } = renderHook(() =>
        useBulkSelection(mockClients)
      )

      // Setup export hook
      const { result: exportResult } = renderHook(() =>
        useBulkExport({
          endpoint: '/api/clients/bulk-export',
          entityName: 'client',
          format: 'csv',
        })
      )

      // Step 1: Select items
      act(() => {
        selectionResult.current.toggleItem('1')
        selectionResult.current.toggleItem('2')
        selectionResult.current.toggleItem('4')
      })

      expect(selectionResult.current.selectedCount).toBe(3)

      // Step 2: Mock successful export response
      const mockBlob = new Blob(['id,name\n1,Client 1\n2,Client 2\n4,Client 4'], {
        type: 'text/csv',
      })
      const mockHeaders = new Headers()
      mockHeaders.set('Content-Disposition', 'attachment; filename="clients-export.csv"')

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: mockHeaders,
        blob: async () => mockBlob,
      })

      // Step 3: Execute export
      await act(async () => {
        await exportResult.current.executeBulkExport(selectionResult.current.selectedIds)
      })

      // Step 4: Verify export was successful
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/clients/bulk-export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: ['1', '2', '4'], format: 'csv' }),
        })
        expect(toast.success).toHaveBeenCalledWith('Successfully exported 3 clients')
        expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
      })
    })

    it('should show loading state during export operation', async () => {
      const { result: selectionResult } = renderHook(() =>
        useBulkSelection(mockClients)
      )

      const { result: exportResult } = renderHook(() =>
        useBulkExport({
          endpoint: '/api/clients/bulk-export',
          entityName: 'client',
        })
      )

      // Select items
      act(() => {
        selectionResult.current.selectAll()
      })

      // Mock delayed response
      ;(global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  headers: new Headers(),
                  blob: async () => new Blob(['test']),
                }),
              100
            )
          )
      )

      // Execute export
      act(() => {
        exportResult.current.executeBulkExport(selectionResult.current.selectedIds)
      })

      // Verify loading state
      expect(exportResult.current.isLoading).toBe(true)

      // Wait for completion
      await waitFor(() => {
        expect(exportResult.current.isLoading).toBe(false)
      })
    })
  })

  describe('Select All and Bulk Operations', () => {
    it('should select all items and perform bulk delete', async () => {
      const { result: selectionResult } = renderHook(() =>
        useBulkSelection(mockClients)
      )

      const { result: deleteResult } = renderHook(() =>
        useBulkDelete({
          endpoint: '/api/clients/bulk-delete',
          entityName: 'client',
        })
      )

      // Select all
      act(() => {
        selectionResult.current.selectAll()
      })

      expect(selectionResult.current.isAllSelected).toBe(true)
      expect(selectionResult.current.selectedCount).toBe(5)

      // Open delete dialog
      act(() => {
        deleteResult.current.openDialog(selectionResult.current.selectedIds)
      })

      expect(deleteResult.current.selectedCount).toBe(5)

      // Mock response
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, count: 5 }),
      })

      // Execute delete
      await act(async () => {
        await deleteResult.current.executeBulkDelete()
      })

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Successfully deleted 5 clients')
      })
    })

    it('should toggle all selection and perform export', async () => {
      const { result: selectionResult } = renderHook(() =>
        useBulkSelection(mockClients)
      )

      const { result: exportResult } = renderHook(() =>
        useBulkExport({
          endpoint: '/api/clients/bulk-export',
          entityName: 'client',
        })
      )

      // Toggle all (should select all)
      act(() => {
        selectionResult.current.toggleAll()
      })

      expect(selectionResult.current.isAllSelected).toBe(true)

      // Mock response
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
        blob: async () => new Blob(['test']),
      })

      // Execute export
      await act(async () => {
        await exportResult.current.executeBulkExport(selectionResult.current.selectedIds)
      })

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Successfully exported 5 clients')
      })
    })
  })

  describe('Error Handling in Bulk Operations', () => {
    it('should handle delete errors and maintain selection', async () => {
      const { result: selectionResult } = renderHook(() =>
        useBulkSelection(mockClients)
      )

      const onError = jest.fn()
      const { result: deleteResult } = renderHook(() =>
        useBulkDelete({
          endpoint: '/api/clients/bulk-delete',
          entityName: 'client',
          onError,
        })
      )

      // Select items
      act(() => {
        selectionResult.current.toggleItem('1')
        selectionResult.current.toggleItem('2')
      })

      // Open dialog
      act(() => {
        deleteResult.current.openDialog(selectionResult.current.selectedIds)
      })

      // Mock error response
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { message: 'Failed to delete clients' },
        }),
      })

      // Execute delete
      await act(async () => {
        await deleteResult.current.executeBulkDelete()
      })

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to delete clients')
        expect(onError).toHaveBeenCalled()
        // Selection should remain unchanged on error
        expect(selectionResult.current.selectedCount).toBe(2)
      })
    })

    it('should handle export errors gracefully', async () => {
      const { result: selectionResult } = renderHook(() =>
        useBulkSelection(mockClients)
      )

      const { result: exportResult } = renderHook(() =>
        useBulkExport({
          endpoint: '/api/clients/bulk-export',
          entityName: 'client',
        })
      )

      // Select items
      act(() => {
        selectionResult.current.selectAll()
      })

      // Mock error response
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { message: 'Export failed' },
        }),
      })

      // Execute export
      await act(async () => {
        await exportResult.current.executeBulkExport(selectionResult.current.selectedIds)
      })

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Export failed')
        expect(exportResult.current.isLoading).toBe(false)
      })
    })
  })

  describe('Progress Indicators', () => {
    it('should show progress through loading states in delete', async () => {
      const { result: deleteResult } = renderHook(() =>
        useBulkDelete({
          endpoint: '/api/clients/bulk-delete',
          entityName: 'client',
        })
      )

      // Initial state - no progress
      expect(deleteResult.current.isLoading).toBe(false)

      // Open dialog
      act(() => {
        deleteResult.current.openDialog(['1', '2'])
      })

      // Dialog open - ready to delete
      expect(deleteResult.current.isDialogOpen).toBe(true)
      expect(deleteResult.current.selectedCount).toBe(2)

      // Mock slow response
      let resolvePromise: any
      ;(global.fetch as jest.Mock).mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePromise = resolve
        })
      )

      // Start delete
      act(() => {
        deleteResult.current.executeBulkDelete()
      })

      // Should show loading
      expect(deleteResult.current.isLoading).toBe(true)

      // Resolve the promise
      act(() => {
        resolvePromise({
          ok: true,
          json: async () => ({ success: true, count: 2 }),
        })
      })

      // Wait for completion
      await waitFor(() => {
        expect(deleteResult.current.isLoading).toBe(false)
        expect(deleteResult.current.isDialogOpen).toBe(false)
      })
    })

    it('should show progress through loading states in export', async () => {
      const { result: exportResult } = renderHook(() =>
        useBulkExport({
          endpoint: '/api/clients/bulk-export',
          entityName: 'client',
        })
      )

      // Initial state
      expect(exportResult.current.isLoading).toBe(false)

      // Mock slow response
      let resolvePromise: any
      ;(global.fetch as jest.Mock).mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePromise = resolve
        })
      )

      // Start export
      act(() => {
        exportResult.current.executeBulkExport(['1', '2', '3'])
      })

      // Should show loading
      expect(exportResult.current.isLoading).toBe(true)

      // Resolve the promise
      act(() => {
        resolvePromise({
          ok: true,
          headers: new Headers(),
          blob: async () => new Blob(['test']),
        })
      })

      // Wait for completion
      await waitFor(() => {
        expect(exportResult.current.isLoading).toBe(false)
      })
    })
  })
})
