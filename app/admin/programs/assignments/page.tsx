"use client"

import { useState, useEffect } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlanDeliveryButton } from "@/components/features/plans/PlanDeliveryButton"
import { Search, Filter, Download, Calendar } from "lucide-react"
import { format } from "date-fns"

interface Assignment {
  assignment_id: string
  plan_name: string
  plan_type: string
  version_number: string
  client_code: string
  client_name: string
  assigned_by_name: string
  start_date: string
  status: string
  delivery_status: string
  delivered_at: string | null
  created_at: string
}

export default function PlanAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deliveryFilter, setDeliveryFilter] = useState("all")

  const user = {
    name: "Admin User",
    email: "admin@trainersaas.com",
    role: "admin",
  }

  const tenantId = "your-tenant-id" // TODO: Get from auth context

  useEffect(() => {
    fetchAssignments()
  }, [statusFilter, deliveryFilter])

  const fetchAssignments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        tenant_id: tenantId,
        status: statusFilter === "all" ? "" : statusFilter,
      })

      const response = await fetch(`/api/plans/assignments?${params}`)
      const data = await response.json()
      setAssignments(data.assignments || [])
    } catch (error) {
      console.error("Failed to fetch assignments:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.client_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.plan_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDelivery =
      deliveryFilter === "all" || assignment.delivery_status === deliveryFilter

    return matchesSearch && matchesDelivery
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: "default",
      completed: "secondary",
      cancelled: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const getDeliveryBadge = (status: string) => {
    const colors: Record<string, string> = {
      delivered: "bg-green-500",
      pending: "bg-yellow-500",
      failed: "bg-red-500",
      sent: "bg-blue-500",
    }
    return (
      <Badge className={colors[status] || "bg-gray-500"}>
        {status}
      </Badge>
    )
  }

  const getPlanTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      training: "bg-blue-500",
      nutrition: "bg-green-500",
      bundle: "bg-purple-500",
    }
    return (
      <Badge className={colors[type] || "bg-gray-500"}>
        {type}
      </Badge>
    )
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plan Assignments</h1>
          <p className="text-muted-foreground">
            Manage and monitor plan deliveries to clients
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search clients or plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Assignment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Delivery Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Deliveries</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={fetchAssignments}>
                <Filter className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assignments List */}
        <Card>
          <CardHeader>
            <CardTitle>Assignments ({filteredAssignments.length})</CardTitle>
            <CardDescription>
              Recent plan assignments and their delivery status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading assignments...</div>
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No assignments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAssignments.map((assignment) => (
                  <div
                    key={assignment.assignment_id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-muted-foreground">
                          {assignment.client_code}
                        </span>
                        <span className="font-semibold">{assignment.client_name}</span>
                        {getStatusBadge(assignment.status)}
                        {getDeliveryBadge(assignment.delivery_status)}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {getPlanTypeBadge(assignment.plan_type)}
                          <span>{assignment.plan_name}</span>
                          <span className="text-xs">v{assignment.version_number}</span>
                        </div>
                        <span>•</span>
                        <span>Start: {format(new Date(assignment.start_date), "MMM d, yyyy")}</span>
                        {assignment.delivered_at && (
                          <>
                            <span>•</span>
                            <span>
                              Delivered: {format(new Date(assignment.delivered_at), "MMM d, yyyy")}
                            </span>
                          </>
                        )}
                      </div>

                      {assignment.assigned_by_name && (
                        <div className="text-xs text-muted-foreground">
                          Assigned by: {assignment.assigned_by_name}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <PlanDeliveryButton
                        assignmentId={assignment.assignment_id}
                        tenantId={tenantId}
                        deliveryStatus={assignment.delivery_status}
                        clientName={assignment.client_name}
                        planName={assignment.plan_name}
                        onDeliveryComplete={fetchAssignments}
                      />
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
