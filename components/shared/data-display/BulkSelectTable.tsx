"use client"

import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/data-table/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { useBulkSelection } from "@/lib/hooks/useBulkSelection"

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface Action<T> {
  label: string
  onClick: (row: T) => void
  icon?: React.ReactNode
}

interface BulkSelectTableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  actions?: Action<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  onRowClick?: (row: T) => void
  emptyMessage?: string
  onSelectionChange?: (selectedItems: T[]) => void
}

export function BulkSelectTable<T extends { id: string } & Record<string, any>>({
  data,
  columns,
  actions = [],
  searchable = true,
  searchPlaceholder = "Search...",
  onRowClick,
  emptyMessage = "No data available",
  onSelectionChange,
}: BulkSelectTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filter data based on search
  const filteredData = searchQuery
    ? data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data

  // Sort data
  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        const modifier = sortDirection === "asc" ? 1 : -1
        return aVal > bVal ? modifier : -modifier
      })
    : filteredData

  // Bulk selection hook
  const {
    isAllSelected,
    isIndeterminate,
    toggleAll,
    toggleItem,
    isSelected,
    selectedItems,
  } = useBulkSelection(sortedData)

  // Notify parent of selection changes
  React.useEffect(() => {
    onSelectionChange?.(selectedItems)
  }, [selectedItems, onSelectionChange])

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Select All Checkbox */}
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                  className={cn(
                    isIndeterminate && "data-[state=checked]:bg-primary/50"
                  )}
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
              {actions.length > 0 && <TableHead className="w-[70px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 2 : 1)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-accent",
                    isSelected(row.id) && "bg-accent/50"
                  )}
                >
                  {/* Row Checkbox */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected(row.id)}
                      onCheckedChange={() => toggleItem(row.id)}
                      aria-label={`Select row ${row.id}`}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      onClick={() => onRowClick?.(row)}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((action, i) => (
                            <DropdownMenuItem
                              key={i}
                              onClick={() => action.onClick(row)}
                            >
                              {action.icon}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {sortedData.length} of {data.length} results
      </div>
    </div>
  )
}
