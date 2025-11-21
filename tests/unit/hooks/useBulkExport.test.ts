/**
 * Tests for useBulkExport hook
 * Tests bulk export functionality including CSV generation, file downloads, and error handling
 */

import { renderHook, act, waitFor } from '@testing-library/react'
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

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = jest.fn()

describe('useBulkExport Hook', () => {
  let mockLink: any
  let createElementSpy: jest.SpyInstance
  let appendChildSpy: jest.SpyInstance
  let removeChildSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
    
    // Create fresh mock link for each test
    mockLink = {
      href: '',
      download: '',
      style: { display: '' },
      click: jest.fn(),
    }
    
    // Mock createElement - return mock link for 'a' tags
    createElementSpy = jest.spyOn(document, 'createElement')
    createElementSpy.mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return mockLink
      }
      // For testing library's container, return a real div
      const div = document.createElement.bind(document)('div')
      return div
    })
    
    // Mock appendChild and removeChild
    appendChildSpy = jest.spyOn(document.body, 'appendChild')
    appendChildSpy.mockImplementation(() => mockLink)
    
    removeChildSpy = jest.spyOn(document.body, 'removeChild')
    removeChildSpy.mockImplementation(() => mockLink)
  })

  afterEach(() => {
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      useBulkExport({
        endpoint: '/api/clients/bulk-export',
        entityName: 'client',
      })
    )

    expect(result.current.isLoading).toBe(false)
  })

  it('should successfully execute bulk export with CSV', async () => {
    const mockBlob = new Blob(['test,data'], { type: 'text/csv' })
    const mockHeaders = new Headers()
    mockHeaders.set('Content-Disposition', 'attachment; filename="clients-export.csv"')

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: mockHeaders,
      blob: async () => mockBlob,
    })

    const { result } = renderHook(() =>
      useBulkExport({
        endpoint: '/api/clients/bulk-export',
        entityName: 'client',
        format: 'csv',
      })
    )

    await act(async () => {
      await result.current.executeBulkExport(['1', '2', '3'])
    })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/clients/bulk-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: ['1', '2', '3'], format: 'csv' }),
      })
      expect(toast.success).toHaveBeenCalledWith('Successfully exported 3 clients')
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
    })
  })

  it('should extract filename from Content-Disposition header', async () => {
    const mockBlob = new Blob(['test'], { type: 'text/csv' })
    const mockHeaders = new Headers()
    mockHeaders.set('Content-Disposition', 'attachment; filename="custom-export-2025-01-15.csv"')

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: mockHeaders,
      blob: async () => mockBlob,
    })

    const { result } = renderHook(() =>
      useBulkExport({
        endpoint: '/api/clients/bulk-export',
        entityName: 'client',
      })
    )

    await act(async () => {
      await result.current.executeBulkExport(['1'])
    })

    await waitFor(() => {
      expect(mockLink.download).toBe('custom-export-2025-01-15.csv')
    })
  })

  it('should generate default filename when header missing', async () => {
    const mockBlob = new Blob(['test'], { type: 'text/csv' })
    const mockHeaders = new Headers()

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: mockHeaders,
      blob: async () => mockBlob,
    })

    const { result } = renderHook(() =>
      useBulkExport({
        endpoint: '/api/clients/bulk-export',
        entityName: 'client',
        format: 'csv',
      })
    )

    await act(async () => {
      await result.current.executeBulkExport(['1'])
    })

    await waitFor(() => {
      expect(mockLink.download).toMatch(/client-export-\d{4}-\d{2}-\d{2}\.csv/)
    })
  })

  it('should handle API error responses', async () => {
    const mockError = {
      error: {
        message: 'Export failed',
      },
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    })

    const { result } = renderHook(() =>
      useBulkExport({
        endpoint: '/api/clients/bulk-export',
        entityName: 'client',
      })
    )

    await act(async () => {
      await result.current.executeBulkExport(['1'])
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Export failed')
    })
  })

  it('should handle network errors', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() =>
      useBulkExport({
        endpoint: '/api/clients/bulk-export',
        entityName: 'client',
      })
    )

    await act(async () => {
      await result.current.executeBulkExport(['1'])
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error')
    })
  })

  it('should not execute with empty IDs array', async () => {
    const { result } = renderHook(() =>
      useBulkExport({
        endpoint: '/api/clients/bulk-export',
        entityName: 'client',
      })
    )

    await act(async () => {
      await result.current.executeBulkExport([])
    })

    expect(global.fetch).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith('No items selected for export')
  })

  it('should set loading state during export', async () => {
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

    const { result } = renderHook(() =>
      useBulkExport({
        endpoint: '/api/clients/bulk-export',
        entityName: 'client',
      })
    )

    act(() => {
      result.current.executeBulkExport(['1'])
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should trigger download with correct blob URL', async () => {
    const mockBlob = new Blob(['test'], { type: 'text/csv' })
    const mockHeaders = new Headers()

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: mockHeaders,
      blob: async () => mockBlob,
    })

    const { result } = renderHook(() =>
      useBulkExport({
        endpoint: '/api/clients/bulk-export',
        entityName: 'client',
      })
    )

    await act(async () => {
      await result.current.executeBulkExport(['1', '2'])
    })

    await waitFor(() => {
      expect(mockLink.href).toBe('blob:mock-url')
      expect(mockLink.click).toHaveBeenCalled()
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink)
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink)
    })
  })

  it('should use custom format parameter', async () => {
    const mockBlob = new Blob(['test'], { type: 'application/pdf' })
    const mockHeaders = new Headers()

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: mockHeaders,
      blob: async () => mockBlob,
    })

    const { result } = renderHook(() =>
      useBulkExport({
        endpoint: '/api/clients/bulk-export',
        entityName: 'client',
        format: 'pdf',
      })
    )

    await act(async () => {
      await result.current.executeBulkExport(['1'])
    })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/clients/bulk-export',
        expect.objectContaining({
          body: JSON.stringify({ ids: ['1'], format: 'pdf' }),
        })
      )
    })
  })
})
