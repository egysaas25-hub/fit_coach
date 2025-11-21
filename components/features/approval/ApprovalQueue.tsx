"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, RefreshCw } from "lucide-react"
import { ApprovalCard, ApprovalWorkflow } from "./ApprovalCard"
import { Skeleton } from "@/components/ui/skeleton"

interface ApprovalQueueProps {
  approvals: ApprovalWorkflow[]
  isLoading?: boolean
  onApprove: (approval: ApprovalWorkflow) => void
  onReject: (approval: ApprovalWorkflow) => void
  onView: (approval: ApprovalWorkflow) => void
  onRefresh?: () => void
}

export function ApprovalQueue({
  approvals,
  isLoading = false,
  onApprove,
  onReject,
  onView,
  onRefresh,
}: ApprovalQueueProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [entityTypeFilter, setEntityTypeFilter] = useState("all")

  // Filter approvals
  const filteredApprovals = approvals.filter((approval) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      approval.metadata?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.metadata?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.submitted_by_team_member?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || approval.status === statusFilter

    // Entity type filter
    const matchesEntityType =
      entityTypeFilter === "all" || approval.entity_type === entityTypeFilter

    return matchesSearch && matchesStatus && matchesEntityType
  })

  // Group by status
  const pendingApprovals = filteredApprovals.filter((a) => a.status === "pending")
  const approvedApprovals = filteredApprovals.filter((a) => a.status === "approved")
  const rejectedApprovals = filteredApprovals.filter((a) => a.status === "rejected")

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 mt-2 sm:mt-0" />
          
          {/* Search */}
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, description, or submitter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground shrink-0">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Entity Type Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground shrink-0">Type:</span>
            <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="exercise">Exercise</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="workout">Workout</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear & Refresh */}
          <div className="flex gap-2 w-full sm:w-auto">
            {(searchQuery || statusFilter !== "all" || entityTypeFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setEntityTypeFilter("all")
                }}
                className="flex-1 sm:flex-none"
              >
                Clear
              </Button>
            )}
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredApprovals.length} of {approvals.length} approvals
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-yellow-600">
            {pendingApprovals.length} pending
          </span>
          <span className="text-green-600">
            {approvedApprovals.length} approved
          </span>
          <span className="text-red-600">
            {rejectedApprovals.length} rejected
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredApprovals.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Filter className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No approvals found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all" || entityTypeFilter !== "all"
                ? "Try adjusting your filters"
                : "No approval workflows to display"}
            </p>
          </div>
        </Card>
      )}

      {/* Approval Cards */}
      {!isLoading && filteredApprovals.length > 0 && (
        <div className="space-y-4">
          {/* Pending Section */}
          {pendingApprovals.length > 0 && (statusFilter === "all" || statusFilter === "pending") && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-yellow-600 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                Pending Review ({pendingApprovals.length})
              </h3>
              {pendingApprovals.map((approval) => (
                <ApprovalCard
                  key={approval.id}
                  approval={approval}
                  onApprove={onApprove}
                  onReject={onReject}
                  onView={onView}
                />
              ))}
            </div>
          )}

          {/* Approved Section */}
          {approvedApprovals.length > 0 && (statusFilter === "all" || statusFilter === "approved") && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-green-600 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Approved ({approvedApprovals.length})
              </h3>
              {approvedApprovals.map((approval) => (
                <ApprovalCard
                  key={approval.id}
                  approval={approval}
                  onApprove={onApprove}
                  onReject={onReject}
                  onView={onView}
                />
              ))}
            </div>
          )}

          {/* Rejected Section */}
          {rejectedApprovals.length > 0 && (statusFilter === "all" || statusFilter === "rejected") && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-red-600 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                Rejected ({rejectedApprovals.length})
              </h3>
              {rejectedApprovals.map((approval) => (
                <ApprovalCard
                  key={approval.id}
                  approval={approval}
                  onApprove={onApprove}
                  onReject={onReject}
                  onView={onView}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
