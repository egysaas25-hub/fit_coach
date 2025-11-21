# Bulk Selection Infrastructure

This directory contains the bulk selection infrastructure for the FitCoach platform, enabling users to select multiple items and perform bulk operations.

## Components

### 1. `useBulkSelection` Hook

A custom React hook for managing bulk selection state.

**Location:** `lib/hooks/useBulkSelection.ts`

**Features:**
- Select/deselect individual items
- Select/deselect all items
- Toggle selection state
- Track selected count
- Indeterminate state support

**Usage:**
```typescript
import { useBulkSelection } from '@/lib/hooks/useBulkSelection';

const items = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
];

const {
  selectedIds,
  selectedItems,
  selectedCount,
  isAllSelected,
  isIndeterminate,
  selectAll,
  deselectAll,
  toggleItem,
  toggleAll,
  isSelected,
} = useBulkSelection(items);
```

**API:**
- `selectedIds: string[]` - Array of selected item IDs
- `selectedItems: T[]` - Array of selected item objects
- `selectedCount: number` - Number of selected items
- `isAllSelected: boolean` - True if all items are selected
- `isIndeterminate: boolean` - True if some (but not all) items are selected
- `selectAll: () => void` - Select all items
- `deselectAll: () => void` - Deselect all items
- `toggleItem: (id: string) => void` - Toggle selection of a single item
- `toggleAll: () => void` - Toggle all items (smart toggle based on current state)
- `isSelected: (id: string) => boolean` - Check if an item is selected
- `selectItems: (ids: string[]) => void` - Select specific items by IDs

### 2. `BulkSelectTable` Component

An enhanced data table with built-in bulk selection functionality.

**Location:** `components/shared/data-display/BulkSelectTable.tsx`

**Features:**
- Checkbox column for row selection
- "Select All" checkbox in header
- Indeterminate state for partial selection
- Visual feedback for selected rows
- Search and sort functionality
- Action dropdown menu
- Integrates with `useBulkSelection` hook

**Usage:**
```typescript
import { BulkSelectTable } from '@/components/shared/data-display/BulkSelectTable';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status', render: (value) => <Badge>{value}</Badge> },
];

const actions = [
  { label: 'Edit', onClick: (row) => handleEdit(row) },
  { label: 'Delete', onClick: (row) => handleDelete(row) },
];

<BulkSelectTable
  data={clients}
  columns={columns}
  actions={actions}
  onSelectionChange={(selectedItems) => setSelected(selectedItems)}
  searchPlaceholder="Search clients..."
/>
```

**Props:**
- `data: T[]` - Array of data items (must have `id` property)
- `columns: Column<T>[]` - Column definitions
- `actions?: Action<T>[]` - Row action menu items
- `searchable?: boolean` - Enable search functionality (default: true)
- `searchPlaceholder?: string` - Search input placeholder
- `onRowClick?: (row: T) => void` - Row click handler
- `emptyMessage?: string` - Message when no data
- `onSelectionChange?: (selectedItems: T[]) => void` - Callback when selection changes

### 3. `BulkActionBar` Component

A floating action bar that appears when items are selected.

**Location:** `components/shared/actions/BulkActionBar.tsx`

**Features:**
- Fixed position at bottom of screen
- Shows selected count
- Clear selection button
- Customizable action buttons
- Smooth animations
- Auto-hides when no items selected

**Usage:**
```typescript
import { BulkActionBar } from '@/components/shared/actions/BulkActionBar';
import { Trash2, Download, Send } from 'lucide-react';

const bulkActions = [
  {
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    onClick: handleBulkDelete,
    variant: 'destructive' as const,
  },
  {
    label: 'Export',
    icon: <Download className="h-4 w-4" />,
    onClick: handleBulkExport,
  },
  {
    label: 'Assign',
    icon: <Send className="h-4 w-4" />,
    onClick: handleBulkAssign,
  },
];

<BulkActionBar
  selectedCount={selectedItems.length}
  actions={bulkActions}
  onClearSelection={deselectAll}
/>
```

**Props:**
- `selectedCount: number` - Number of selected items
- `actions: BulkAction[]` - Array of bulk actions
- `onClearSelection?: () => void` - Clear selection handler
- `className?: string` - Additional CSS classes

**BulkAction Interface:**
```typescript
interface BulkAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
}
```

## Complete Example

Here's a complete example showing all components working together:

```typescript
'use client';

import { useState } from 'react';
import { BulkSelectTable } from '@/components/shared/data-display/BulkSelectTable';
import { BulkActionBar } from '@/components/shared/actions/BulkActionBar';
import { Trash2, Download, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  email: string;
  status: string;
}

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([...]);
  const [selectedItems, setSelectedItems] = useState<Client[]>([]);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status' },
  ];

  const handleBulkDelete = async () => {
    try {
      const ids = selectedItems.map(item => item.id);
      await fetch('/api/clients/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids }),
      });
      toast.success(`Deleted ${ids.length} clients`);
      setSelectedItems([]);
    } catch (error) {
      toast.error('Failed to delete clients');
    }
  };

  const handleBulkExport = () => {
    const csv = generateCSV(selectedItems);
    downloadCSV(csv, 'clients.csv');
    toast.success(`Exported ${selectedItems.length} clients`);
  };

  const bulkActions = [
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleBulkDelete,
      variant: 'destructive' as const,
    },
    {
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      onClick: handleBulkExport,
    },
  ];

  return (
    <div>
      <BulkSelectTable
        data={clients}
        columns={columns}
        onSelectionChange={setSelectedItems}
        searchPlaceholder="Search clients..."
      />
      
      <BulkActionBar
        selectedCount={selectedItems.length}
        actions={bulkActions}
        onClearSelection={() => setSelectedItems([])}
      />
    </div>
  );
}
```

## Design Decisions

1. **Hook-based state management**: The `useBulkSelection` hook provides a reusable, testable way to manage selection state.

2. **Floating action bar**: The action bar is fixed at the bottom center for easy access and doesn't interfere with table scrolling.

3. **Visual feedback**: Selected rows have a background color to clearly indicate selection state.

4. **Indeterminate checkbox**: The "Select All" checkbox shows an indeterminate state when some (but not all) items are selected.

5. **Type safety**: All components are fully typed with TypeScript generics for type-safe usage.

6. **Accessibility**: Proper ARIA labels and keyboard navigation support.

## Requirements Satisfied

- **Requirement 5.1**: Checkboxes for multi-select on list pages ✓
- **Requirement 5.2**: Display available bulk actions when items are selected ✓

## Next Steps

To complete the bulk operations feature:
1. Implement bulk delete functionality (Task 17)
2. Implement bulk export functionality (Task 18)
3. Integrate into list pages (Task 19)
