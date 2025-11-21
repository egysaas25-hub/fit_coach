/**
 * Tests for useBulkSelection hook
 * Tests bulk selection functionality including select all, deselect, and toggle operations
 */

import { renderHook, act } from '@testing-library/react'
import { useBulkSelection } from '@/lib/hooks/useBulkSelection'

describe('useBulkSelection Hook', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ]

  it('should initialize with empty selection', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems))

    expect(result.current.selectedCount).toBe(0)
    expect(result.current.selectedItems).toEqual([])
    expect(result.current.selectedIds).toEqual([])
    expect(result.current.isAllSelected).toBe(false)
    expect(result.current.isIndeterminate).toBe(false)
  })

  it('should select all items', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems))

    act(() => {
      result.current.selectAll()
    })

    expect(result.current.selectedCount).toBe(3)
    expect(result.current.selectedIds).toEqual(['1', '2', '3'])
    expect(result.current.isAllSelected).toBe(true)
    expect(result.current.isIndeterminate).toBe(false)
  })

  it('should deselect all items', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems))

    act(() => {
      result.current.selectAll()
    })

    expect(result.current.selectedCount).toBe(3)

    act(() => {
      result.current.deselectAll()
    })

    expect(result.current.selectedCount).toBe(0)
    expect(result.current.selectedIds).toEqual([])
    expect(result.current.isAllSelected).toBe(false)
  })

  it('should toggle single item selection', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems))

    act(() => {
      result.current.toggleItem('1')
    })

    expect(result.current.selectedCount).toBe(1)
    expect(result.current.selectedIds).toContain('1')
    expect(result.current.isSelected('1')).toBe(true)

    act(() => {
      result.current.toggleItem('1')
    })

    expect(result.current.selectedCount).toBe(0)
    expect(result.current.isSelected('1')).toBe(false)
  })

  it('should show indeterminate state when some items selected', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems))

    act(() => {
      result.current.toggleItem('1')
      result.current.toggleItem('2')
    })

    expect(result.current.selectedCount).toBe(2)
    expect(result.current.isIndeterminate).toBe(true)
    expect(result.current.isAllSelected).toBe(false)
  })

  it('should toggle all items correctly', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems))

    // Toggle all when none selected - should select all
    act(() => {
      result.current.toggleAll()
    })

    expect(result.current.isAllSelected).toBe(true)
    expect(result.current.selectedCount).toBe(3)

    // Toggle all when all selected - should deselect all
    act(() => {
      result.current.toggleAll()
    })

    expect(result.current.isAllSelected).toBe(false)
    expect(result.current.selectedCount).toBe(0)
  })

  it('should return selected items with full data', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems))

    act(() => {
      result.current.toggleItem('1')
      result.current.toggleItem('3')
    })

    expect(result.current.selectedItems).toHaveLength(2)
    expect(result.current.selectedItems[0]).toEqual({ id: '1', name: 'Item 1' })
    expect(result.current.selectedItems[1]).toEqual({ id: '3', name: 'Item 3' })
  })

  it('should select specific items by IDs', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems))

    act(() => {
      result.current.selectItems(['1', '3'])
    })

    expect(result.current.selectedCount).toBe(2)
    expect(result.current.selectedIds).toEqual(['1', '3'])
    expect(result.current.isSelected('1')).toBe(true)
    expect(result.current.isSelected('2')).toBe(false)
    expect(result.current.isSelected('3')).toBe(true)
  })

  it('should handle empty items array', () => {
    const { result } = renderHook(() => useBulkSelection([]))

    expect(result.current.selectedCount).toBe(0)
    expect(result.current.isAllSelected).toBe(false)
    expect(result.current.isIndeterminate).toBe(false)
  })

  it('should update selection when items change', () => {
    const { result, rerender } = renderHook(
      ({ items }) => useBulkSelection(items),
      { initialProps: { items: mockItems } }
    )

    act(() => {
      result.current.selectAll()
    })

    expect(result.current.selectedCount).toBe(3)

    // Update items to remove one
    const newItems = mockItems.slice(0, 2)
    rerender({ items: newItems })

    // Selection should still have 3 IDs, but selectedItems should only have 2
    expect(result.current.selectedIds).toHaveLength(3)
    expect(result.current.selectedItems).toHaveLength(2)
  })

  it('should handle selecting non-existent item', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems))

    act(() => {
      result.current.toggleItem('999')
    })

    expect(result.current.selectedCount).toBe(1)
    expect(result.current.selectedItems).toHaveLength(0) // No matching item
  })
})
