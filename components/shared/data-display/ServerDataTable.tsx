"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ColumnDef<T> {
  accessorKey: string
  header: string
  cell?: (props: { row: { original: T }; getValue: () => any }) => React.ReactNode
  sortable?: boolean
}

export interface FilterConfig {
  key: string
  label: string
  options?: string[]
  optionsEndpoint?: string
}

export interface BulkAction<T> {
  label: string
  action: (selectedRows: T[]) => void | Promise<void>
}

interface ServerDataTableProps<T> {
  columns: ColumnDef<T>[]
  apiEndpoint: string
  filters?: FilterConfig[]
  searchPlaceholder?: string
  onRowClick?: (row: T) => void
  bulkActions?: BulkAction<T>[]
  pageSize?: number
}

interface TableData<T> {
  rows: T[]
  total: number
  page: number
  pageSize: number
}

export function ServerDataTable<T extends { id: string | number }>({
  columns,
  apiEndpoint,
  filters = [],
  searchPlaceholder = "Search...",
  onRowClick,
  bulkActions = [],
  pageSize = 50,
}: ServerDataTableProps<T>) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to first page on search
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Build query params
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(sortBy && { sortBy, sortOrder }),
    ...filterValues,
  })

  // Fetch data
  const { data, isLoading, error } = useQuery<TableData<T>>({
    queryKey: ['table', apiEndpoint, page, pageSize, debouncedSearch, sortBy, sortOrder, filterValues],
    queryFn: async () => {
      const response = await fetch(`${apiEndpoint}?${queryParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      return response.json()
    },
  })

  // Handle sort
  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(columnKey)
      setSortOrder('asc')
    }
    setPage(1)
  }

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  // Handle row selection
  const toggleRowSelection = (id: string | number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const toggleAllRows = () => {
    if (selectedRows.size === data?.rows.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data?.rows.map(row => row.id) || []))
    }
  }

  // Pagination
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0
  const startRow = data ? (page - 1) * pageSize + 1 : 0
  const endRow = data ? Math.min(page * pageSize, data.total) : 0

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filterValues[filter.key] || ''}
            onValueChange={(value) => handleFilterChange(filter.key, value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All {filter.label}</SelectItem>
              {filter.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {/* Bulk Actions */}
        {bulkActions.length > 0 && selectedRows.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedRows.size} selected
            </span>
            {bulkActions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => {
                  const selected = data?.rows.filter(row => selectedRows.has(row.id)) || []
                  action.action(selected)
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {bulkActions.length > 0 && (
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data?.rows.length && data?.rows.length > 0}
                    onChange={toggleAllRows}
                    className="cursor-pointer"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8"
                      onClick={() => handleSort(column.accessorKey)}
                    >
                      {column.header}
                      {sortBy === column.accessorKey && (
                        <span className="ml-2">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {bulkActions.length > 0 && (
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)}
                  className="h-24 text-center text-destructive"
                >
                  Error loading data. Please try again.
                </TableCell>
              </TableRow>
            ) : !data || data.rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              data.rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(onRowClick && "cursor-pointer hover:bg-accent")}
                  onClick={() => onRowClick?.(row)}
                >
                  {bulkActions.length > 0 && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => toggleRowSelection(row.id)}
                        className="cursor-pointer"
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell
                        ? column.cell({
                            row: { original: row },
                            getValue: () => (row as any)[column.accessorKey],
                          })
                        : (row as any)[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startRow} to {endRow} of {data.total} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
