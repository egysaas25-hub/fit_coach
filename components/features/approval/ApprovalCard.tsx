"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Clock, Sparkles, Dumbbell, Apple } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils/cn"

export interface ApprovalWorkflow {
  id: string
  entity_type: string
  entity_id: string
  status: "pending" | "approved" | "rejected"
  submitted_by: string
  reviewed_by: string | null
  reviewed_at: Date | null
  notes: string | null
  metadata: any
  created_at: Date
  updated_at: Date
  submitted_by_team_member: {
    id: string
    full_name: string
    email: string
    role: string
  } | null
  reviewed_by_team_member: {
    id: string
    full_name: string
    email: string
    role: string
  } | null
}

interface ApprovalCardProps {
  approval: ApprovalWorkflow
  onApprove: (approval: ApprovalWorkflow) => void
  onReject: (approval: ApprovalWorkflow) => void
  onView: (approval: ApprovalWorkflow) => void
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

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending Review",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  approved: {
    icon: CheckCircle,
    label: "Approved",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
}

export function ApprovalCard({
  approval,
  onApprove,
  onReject,
  onView,
}: ApprovalCardProps) {
  const entityConfig = entityTypeConfig[approval.entity_type as keyof typeof entityTypeConfig] || entityTypeConfig.exercise
  const statusInfo = statusConfig[approval.status]
  const EntityIcon = entityConfig.icon
  const StatusIcon = statusInfo.icon

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  return (
    <Card
      className={cn(
        "p-4 hover:shadow-md transition-shadow cursor-pointer",
        approval.status === "pending" && "border-l-4 border-l-yellow-500"
      )}
      onClick={() => onView(approval)}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Entity Icon */}
            <div className={cn("rounded-lg p-2", entityConfig.bg)}>
              <EntityIcon className={cn("h-5 w-5", entityConfig.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={cn(entityConfig.bg, entityConfig.color)}>
                  {entityConfig.label}
                </Badge>
                <Sparkles className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">AI Generated</span>
              </div>
              
              <h3 className="font-semibold text-sm truncate">
                {approval.metadata?.name || `${entityConfig.label} #${approval.entity_id}`}
              </h3>
              
              {approval.metadata?.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {approval.metadata.description}
                </p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <Badge variant="outline" className={cn(statusInfo.bg, statusInfo.color, statusInfo.border)}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusInfo.label}
          </Badge>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {approval.submitted_by_team_member
                  ? getInitials(approval.submitted_by_team_member.full_name)
                  : "AI"}
              </AvatarFallback>
            </Avatar>
            <span>
              {approval.submitted_by_team_member?.full_name || "AI System"}
            </span>
          </div>
          <span>•</span>
          <span>{formatTime(approval.created_at)}</span>
        </div>

        {/* Review Info */}
        {approval.status !== "pending" && approval.reviewed_by_team_member && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">
                {approval.status === "approved" ? "Approved" : "Rejected"} by
              </span>
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(approval.reviewed_by_team_member.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">
                {approval.reviewed_by_team_member.full_name}
              </span>
              {approval.reviewed_at && (
                <>
                  <span>•</span>
                  <span className="text-muted-foreground">
                    {formatTime(approval.reviewed_at)}
                  </span>
                </>
              )}
            </div>
            {approval.notes && (
              <p className="text-xs text-muted-foreground mt-2 italic">
                "{approval.notes}"
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {approval.status === "pending" && (
          <div className="flex gap-2 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-green-600 hover:bg-green-50 hover:text-green-700 border-green-200"
              onClick={() => onApprove(approval)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
              onClick={() => onReject(approval)}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
