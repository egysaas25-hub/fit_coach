"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Sparkles, Dumbbell, Apple } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { ApprovalWorkflow } from "./ApprovalCard"

interface ApprovalModalProps {
  approval: ApprovalWorkflow | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (approvalId: string, notes: string) => Promise<void>
  onReject: (approvalId: string, notes: string) => Promise<void>
}

const entityTypeConfig = {
  exercise: {
    icon: Dumbbell,
    label: "Exercise",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  nutrition: {
    icon: Apple,
    label: "Nutrition Plan",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  workout: {
    icon: Dumbbell,
    label: "Workout",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
}

export function ApprovalModal({
  approval,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ApprovalModalProps) {
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!approval) return null

  const entityConfig = entityTypeConfig[approval.entity_type as keyof typeof entityTypeConfig] || entityTypeConfig.exercise
  const EntityIcon = entityConfig.icon

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      await onApprove(approval.id, notes)
      setNotes("")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to approve:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!notes.trim()) {
      alert("Please provide a reason for rejection")
      return
    }
    
    setIsSubmitting(true)
    try {
      await onReject(approval.id, notes)
      setNotes("")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to reject:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("rounded-lg p-2", entityConfig.bg)}>
              <EntityIcon className={cn("h-5 w-5", entityConfig.color)} />
            </div>
            <div className="flex-1">
              <DialogTitle>Review AI-Generated Content</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn(entityConfig.bg, entityConfig.color)}>
                  {entityConfig.label}
                </Badge>
                <Sparkles className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">AI Generated</span>
              </div>
            </div>
          </div>
          <DialogDescription>
            Review the AI-generated content below and approve or reject it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content Details */}
          <div className="rounded-lg border p-4 space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <p className="font-semibold">
                {approval.metadata?.name || `${entityConfig.label} #${approval.entity_id}`}
              </p>
            </div>

            {approval.metadata?.description && (
              <div>
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm">{approval.metadata.description}</p>
              </div>
            )}

            {approval.metadata?.difficulty && (
              <div>
                <Label className="text-xs text-muted-foreground">Difficulty</Label>
                <Badge variant="secondary" className="capitalize">
                  {approval.metadata.difficulty}
                </Badge>
              </div>
            )}

            {approval.metadata?.muscle_groups && approval.metadata.muscle_groups.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">Muscle Groups</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {approval.metadata.muscle_groups.map((muscle: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {approval.metadata?.equipment && approval.metadata.equipment.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">Equipment</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {approval.metadata.equipment.map((item: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {approval.metadata?.instructions && (
              <div>
                <Label className="text-xs text-muted-foreground">Instructions</Label>
                <ol className="text-sm space-y-1 mt-1 list-decimal list-inside">
                  {approval.metadata.instructions.map((instruction: string, index: number) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            )}

            {approval.metadata?.meals && (
              <div>
                <Label className="text-xs text-muted-foreground">Meals</Label>
                <div className="space-y-2 mt-1">
                  {approval.metadata.meals.map((meal: any, index: number) => (
                    <div key={index} className="text-sm border-l-2 pl-3">
                      <p className="font-medium">{meal.name}</p>
                      {meal.foods && (
                        <ul className="text-xs text-muted-foreground mt-1">
                          {meal.foods.map((food: any, fi: number) => (
                            <li key={fi}>
                              {food.name} - {food.quantity} {food.unit}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submitter Info */}
          <div className="text-xs text-muted-foreground">
            Submitted by{" "}
            <span className="font-medium text-foreground">
              {approval.submitted_by_team_member?.full_name || "AI System"}
            </span>
          </div>

          {/* Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              Review Notes {approval.status === "pending" && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="notes"
              placeholder={
                approval.status === "pending"
                  ? "Add notes about your decision (required for rejection)..."
                  : "No notes provided"
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              {approval.status === "pending"
                ? "Notes are optional for approval but required for rejection"
                : ""}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
            onClick={handleReject}
            disabled={isSubmitting}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleApprove}
            disabled={isSubmitting}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
