/**
 * Tests for BulkActionBar component
 * Tests UI rendering, action buttons, and progress indicators
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { BulkActionBar, BulkAction } from '@/components/shared/actions/BulkActionBar'
import { Trash2, Download } from 'lucide-react'

describe('BulkActionBar Component', () => {
  const mockActions: BulkAction[] = [
    {
      label: 'Delete',
      onClick: jest.fn(),
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
    },
    {
      label: 'Export',
      onClick: jest.fn(),
      icon: <Download className="h-4 w-4" />,
      variant: 'default',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render when no items are selected', () => {
    const { container } = render(
      <BulkActionBar selectedCount={0} actions={mockActions} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render when items are selected', () => {
    render(<BulkActionBar selectedCount={3} actions={mockActions} />)

    expect(screen.getByText('3 items selected')).toBeInTheDocument()
  })

  it('should display singular "item" for count of 1', () => {
    render(<BulkActionBar selectedCount={1} actions={mockActions} />)

    expect(screen.getByText('1 item selected')).toBeInTheDocument()
  })

  it('should display plural "items" for count > 1', () => {
    render(<BulkActionBar selectedCount={5} actions={mockActions} />)

    expect(screen.getByText('5 items selected')).toBeInTheDocument()
  })

  it('should render all action buttons', () => {
    render(<BulkActionBar selectedCount={2} actions={mockActions} />)

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
  })

  it('should call action onClick when button is clicked', () => {
    render(<BulkActionBar selectedCount={2} actions={mockActions} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(mockActions[0].onClick).toHaveBeenCalledTimes(1)
  })

  it('should render clear selection button when onClearSelection provided', () => {
    const onClearSelection = jest.fn()
    render(
      <BulkActionBar
        selectedCount={3}
        actions={mockActions}
        onClearSelection={onClearSelection}
      />
    )

    const clearButton = screen.getByLabelText('Clear selection')
    expect(clearButton).toBeInTheDocument()

    fireEvent.click(clearButton)
    expect(onClearSelection).toHaveBeenCalledTimes(1)
  })

  it('should not render clear button when onClearSelection not provided', () => {
    render(<BulkActionBar selectedCount={3} actions={mockActions} />)

    const clearButton = screen.queryByLabelText('Clear selection')
    expect(clearButton).not.toBeInTheDocument()
  })

  it('should disable action buttons when disabled prop is true', () => {
    const disabledActions: BulkAction[] = [
      {
        label: 'Delete',
        onClick: jest.fn(),
        disabled: true,
      },
    ]

    render(<BulkActionBar selectedCount={2} actions={disabledActions} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    expect(deleteButton).toBeDisabled()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={2}
        actions={mockActions}
        className="custom-class"
      />
    )

    const actionBar = container.firstChild as HTMLElement
    expect(actionBar).toHaveClass('custom-class')
  })

  it('should render with correct variant styles', () => {
    render(<BulkActionBar selectedCount={2} actions={mockActions} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    const exportButton = screen.getByRole('button', { name: /export/i })

    // Check that buttons have different variant classes
    expect(deleteButton.className).toContain('destructive')
    expect(exportButton.className).not.toContain('destructive')
  })

  it('should render action icons', () => {
    render(<BulkActionBar selectedCount={2} actions={mockActions} />)

    // Icons should be rendered within buttons
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    const exportButton = screen.getByRole('button', { name: /export/i })

    expect(deleteButton.querySelector('svg')).toBeInTheDocument()
    expect(exportButton.querySelector('svg')).toBeInTheDocument()
  })

  it('should handle multiple action clicks independently', () => {
    render(<BulkActionBar selectedCount={2} actions={mockActions} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    const exportButton = screen.getByRole('button', { name: /export/i })

    fireEvent.click(deleteButton)
    fireEvent.click(exportButton)

    expect(mockActions[0].onClick).toHaveBeenCalledTimes(1)
    expect(mockActions[1].onClick).toHaveBeenCalledTimes(1)
  })

  it('should render with fixed positioning at bottom center', () => {
    const { container } = render(
      <BulkActionBar selectedCount={2} actions={mockActions} />
    )

    const actionBar = container.firstChild as HTMLElement
    expect(actionBar.className).toContain('fixed')
    expect(actionBar.className).toContain('bottom-6')
    expect(actionBar.className).toContain('left-1/2')
    expect(actionBar.className).toContain('-translate-x-1/2')
  })

  it('should have animation classes', () => {
    const { container } = render(
      <BulkActionBar selectedCount={2} actions={mockActions} />
    )

    const actionBar = container.firstChild as HTMLElement
    expect(actionBar.className).toContain('animate-in')
    expect(actionBar.className).toContain('slide-in-from-bottom-5')
  })

  it('should render divider between count and actions', () => {
    const { container } = render(
      <BulkActionBar selectedCount={2} actions={mockActions} />
    )

    const divider = container.querySelector('.bg-border')
    expect(divider).toBeInTheDocument()
  })

  it('should handle empty actions array', () => {
    render(<BulkActionBar selectedCount={2} actions={[]} />)

    expect(screen.getByText('2 items selected')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })

  it('should update when selectedCount changes', () => {
    const { rerender } = render(
      <BulkActionBar selectedCount={2} actions={mockActions} />
    )

    expect(screen.getByText('2 items selected')).toBeInTheDocument()

    rerender(<BulkActionBar selectedCount={5} actions={mockActions} />)

    expect(screen.getByText('5 items selected')).toBeInTheDocument()
  })

  it('should unmount when selectedCount becomes 0', () => {
    const { rerender, container } = render(
      <BulkActionBar selectedCount={2} actions={mockActions} />
    )

    expect(container.firstChild).not.toBeNull()

    rerender(<BulkActionBar selectedCount={0} actions={mockActions} />)

    expect(container.firstChild).toBeNull()
  })
})
