/**
 * Tests for useBulkDelete hook
 * Tests bulk delete functionality including API calls, loading states, and error handling
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useBulkDelete } from '@/lib/hooks/useBulkDelete'
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

describe('useBulkDelete Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      useBulkDelete({
        endpoint: '/api/clients/bulk-delete',
        entityName: 'client',
      })
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isDialogOpen).toBe(false)
    expect(result.current.selectedCount).toBe(0)
  })

  it('should open dialog with selected IDs', () => {
    const { result } = renderHook(() =>
      useBulkDelete({
        endpoint: '/api/clients/bulk-delete',
        entityName: 'client',
      })
    )

    act(() => {
      result.current.openDialog(['1', '2', '3'])
    })

    expect(result.current.isDialogOpen).toBe(true)
    expect(result.current.selectedCount).toBe(3)
  })

  it('should close dialog and reset state', () => {
    const { result } = renderHook(() =>
      useBulkDelete({
        endpoint: '/api/clients/bulk-delete',
        entityName: 'client',
      })
    )

    act(() => {
      result.current.openDialog(['1', '2'])
    })

    expect(result.current.isDialogOpen).toBe(true)

    act(() => {
      result.current.closeDialog()
    })

    expect(result.current.isDialogOpen).toBe(false)
    expect(result.current.selectedCount).toBe(0)
  })

  it('should successfully execute bulk delete', async () => {
    const mockResponse = {
      success: true,
      message: 'Successfully deleted 2 clients',
      count: 2,
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const onSuccess = jest.fn()
    const { result } = renderHook(() =>
      useBulkDelete({
        endpoint: '/api/clients/bulk-delete',
        entityName: 'client',
        onSuccess,
      })
    )

    act(() => {
      result.current.openDialog(['1', '2'])
    })

    await act(async () => {
      await result.current.executeBulkDelete()
    })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/clients/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: ['1', '2'] }),
      })
      expect(toast.success).toHaveBeenCalledWith('Successfully deleted 2 clients')
      expect(onSuccess).toHaveBeenCalled()
      expect(result.current.isDialogOpen).toBe(false)
    })
  })

  it('should handle API error responses', async () => {
    const mockError = {
      error: {
        message: 'Failed to delete clients',
      },
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    })

    const onError = jest.fn()
    const { result } = renderHook(() =>
      useBulkDelete({
        endpoint: '/api/clients/bulk-delete',
        entityName: 'client',
        onError,
      })
    )

    act(() => {
      result.current.openDialog(['1', '2'])
    })

    await act(async () => {
      await result.current.executeBulkDelete()
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete clients')
      expect(onError).toHaveBeenCalled()
    })
  })

  it('should handle network errors', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const onError = jest.fn()
    const { result } = renderHook(() =>
      useBulkDelete({
        endpoint: '/api/clients/bulk-delete',
        entityName: 'client',
        onError,
      })
    )

    act(() => {
      result.current.openDialog(['1'])
    })

    await act(async () => {
      await result.current.executeBulkDelete()
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error')
      expect(onError).toHaveBeenCalled()
    })
  })

  it('should set loading state during delete operation', async () => {
    ;(global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ success: true, count: 1 }),
              }),
            100
          )
        )
    )

    const { result } = renderHook(() =>
      useBulkDelete({
        endpoint: '/api/clients/bulk-delete',
        entityName: 'client',
      })
    )

    act(() => {
      result.current.openDialog(['1'])
    })

    act(() => {
      result.current.executeBulkDelete()
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should not execute with empty IDs', async () => {
    const { result } = renderHook(() =>
      useBulkDelete({
        endpoint: '/api/clients/bulk-delete',
        entityName: 'client',
      })
    )

    await act(async () => {
      await result.current.executeBulkDelete()
    })

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should use custom entity name in success message', async () => {
    const mockResponse = {
      success: true,
      count: 3,
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const { result } = renderHook(() =>
      useBulkDelete({
        endpoint: '/api/teams/members/bulk-delete',
        entityName: 'team member',
      })
    )

    act(() => {
      result.current.openDialog(['1', '2', '3'])
    })

    await act(async () => {
      await result.current.executeBulkDelete()
    })

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Successfully deleted 3 team members')
    })
  })
})
