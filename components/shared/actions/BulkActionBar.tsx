"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"
import { X } from "lucide-react"

export interface BulkAction {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  disabled?: boolean
}

interface BulkActionBarProps {
  selectedCount: number
  actions: BulkAction[]
  onClearSelection?: () => void
  className?: string
}

export function BulkActionBar({
  selectedCount,
  actions,
  onClearSelection,
  className,
}: BulkActionBarProps) {
  // Don't render if no items are selected
  if (selectedCount === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "bg-background border rounded-lg shadow-lg",
        "px-4 py-3 flex items-center gap-4",
        "animate-in slide-in-from-bottom-5 duration-300",
        className
      )}
    >
      {/* Selected count */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
        </span>
        {onClearSelection && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-6 w-6 p-0"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-border" />

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "default"}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
            className="gap-2"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
