"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Sparkles, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { ApprovalQueue } from "@/components/features/approval/ApprovalQueue"
import { ApprovalModal } from "@/components/features/approval/ApprovalModal"
import { ApprovalWorkflow } from "@/components/features/approval/ApprovalCard"

// Fetch approvals from API
async function fetchApprovals(tenantId: string, status: string = "all") {
  const params = new URLSearchParams({
    tenant_id: tenantId,
    ...(status !== "all" && { status }),
  })

  const response = await fetch(`/api/approvals?${params}`, {
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch approvals")
  }

  const data = await response.json()
  return data.approvals as ApprovalWorkflow[]
}

// Approve an approval workflow
async function approveApproval(approvalId: string, notes: string) {
  const response = await fetch(`/api/approvals/${approvalId}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ notes }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to approve")
  }

  return response.json()
}

// Reject an approval workflow
async function rejectApproval(approvalId: string, notes: string) {
  const response = await fetch(`/api/approvals/${approvalId}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ notes }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to reject")
  }

  return response.json()
}

export default function ApprovalsPage() {
  const queryClient = useQueryClient()
  const [selectedApproval, setSelectedApproval] = useState<ApprovalWorkflow | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // TODO: Get tenant ID from auth context
  const tenantId = "1" // Hardcoded for now

  // Fetch approvals
  const { data: approvals = [], isLoading, error, refetch } = useQuery({
    queryKey: ["approvals", tenantId],
    queryFn: () => fetchApprovals(tenantId),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: ({ approvalId, notes }: { approvalId: string; notes: string }) =>
      approveApproval(approvalId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] })
      toast.success("Content approved successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve content")
    },
  })

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ approvalId, notes }: { approvalId: string; notes: string }) =>
      rejectApproval(approvalId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] })
      toast.success("Content rejected")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject content")
    },
  })

  const handleApprove = (approval: ApprovalWorkflow) => {
    setSelectedApproval(approval)
    setIsModalOpen(true)
  }

  const handleReject = (approval: ApprovalWorkflow) => {
    setSelectedApproval(approval)
    setIsModalOpen(true)
  }

  const handleView = (approval: ApprovalWorkflow) => {
    setSelectedApproval(approval)
    setIsModalOpen(true)
  }

  const handleModalApprove = async (approvalId: string, notes: string) => {
    await approveMutation.mutateAsync({ approvalId, notes })
  }

  const handleModalReject = async (approvalId: string, notes: string) => {
    await rejectMutation.mutateAsync({ approvalId, notes })
  }

  // Calculate stats
  const pendingCount = approvals.filter((a) => a.status === "pending").length
  const approvedCount = approvals.filter((a) => a.status === "approved").length
  const rejectedCount = approvals.filter((a) => a.status === "rejected").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Content Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve AI-generated content before it's added to your library
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <Badge variant="outline" className="text-base">
            {pendingCount} pending
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2 bg-yellow-500/10">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2 bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{approvedCount}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2 bg-red-500/10">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{rejectedCount}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Info Banner */}
      {pendingCount > 0 && (
        <Card className="p-4 bg-yellow-500/5 border-yellow-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Action Required</h3>
              <p className="text-sm text-muted-foreground">
                You have {pendingCount} AI-generated {pendingCount === 1 ? "item" : "items"} waiting for review.
                Approved content will be added to your library and available for use.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-8">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to load approvals</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {/* Approval Queue */}
      {!error && (
        <ApprovalQueue
          approvals={approvals}
          isLoading={isLoading}
          onApprove={handleApprove}
          onReject={handleReject}
          onView={handleView}
          onRefresh={() => refetch()}
        />
      )}

      {/* Approval Modal */}
      <ApprovalModal
        approval={selectedApproval}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onApprove={handleModalApprove}
        onReject={handleModalReject}
      />
    </div>
  )
}
