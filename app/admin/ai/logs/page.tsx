"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/layouts/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, AlertCircle, CheckCircle, Clock } from "lucide-react"

const mockLogs = [
  {
    id: 1,
    timestamp: "2025-01-15 14:32:15",
    user: "John Trainer",
    userRole: "Trainer",
    template: "Workout Plan Generator",
    prompt: "Generate a personalized workout plan for a intermediate individual...",
    response: "Here is a comprehensive 4-day workout split...",
    status: "success",
    tokensUsed: 1247,
    responseTime: "2.3s",
    cost: "$0.0249",
  },
  {
    id: 2,
    timestamp: "2025-01-15 14:28:42",
    user: "Sarah Admin",
    userRole: "Admin",
    template: "Progress Analysis",
    prompt: "Analyze the client progress data: weight decreased 5lbs...",
    response: "Based on the data provided, the client is showing excellent progress...",
    status: "success",
    tokensUsed: 892,
    responseTime: "1.8s",
    cost: "$0.0178",
  },
  {
    id: 3,
    timestamp: "2025-01-15 14:15:33",
    user: "Mike Trainer",
    userRole: "Trainer",
    template: "Meal Plan Creator",
    prompt: "Create a 2000 calorie meal plan for vegetarian diet...",
    response: "Error: API rate limit exceeded",
    status: "error",
    tokensUsed: 0,
    responseTime: "0.5s",
    cost: "$0.00",
  },
  {
    id: 4,
    timestamp: "2025-01-15 14:10:21",
    user: "Emily Trainer",
    userRole: "Trainer",
    template: "Exercise Form Correction",
    prompt: "Analyze the exercise form for deadlift and provide...",
    response: "For proper deadlift form, ensure the following key points...",
    status: "success",
    tokensUsed: 634,
    responseTime: "1.5s",
    cost: "$0.0127",
  },
  {
    id: 5,
    timestamp: "2025-01-15 13:58:12",
    user: "David Admin",
    userRole: "Admin",
    template: "Injury Recovery Plan",
    prompt: "Create a recovery plan for knee injury with exercises...",
    response: "Request timed out",
    status: "timeout",
    tokensUsed: 0,
    responseTime: "30.0s",
    cost: "$0.00",
  },
  {
    id: 6,
    timestamp: "2025-01-15 13:45:08",
    user: "Lisa Trainer",
    userRole: "Trainer",
    template: "Workout Plan Generator",
    prompt: "Generate a personalized workout plan for a beginner...",
    response: "Here is a beginner-friendly 3-day full body workout...",
    status: "success",
    tokensUsed: 1105,
    responseTime: "2.1s",
    cost: "$0.0221",
  },
]

export default function AILogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLog, setSelectedLog] = useState<(typeof mockLogs)[0] | null>(null)

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalTokens = mockLogs.reduce((sum, log) => sum + log.tokensUsed, 0)
  const totalCost = mockLogs.reduce((sum, log) => sum + Number.parseFloat(log.cost.replace("$", "")), 0)
  const successRate = ((mockLogs.filter((l) => l.status === "success").length / mockLogs.length) * 100).toFixed(1)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "timeout":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Integration Logs</h1>
              <p className="text-sm text-muted-foreground">Monitor AI API calls and usage</p>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockLogs.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{successRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {mockLogs.filter((l) => l.status === "success").length} successful
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tokens Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalTokens.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Total tokens consumed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">${totalCost.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">API usage cost</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Request Logs</CardTitle>
                  <CardDescription>View detailed AI API call history</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="timeout">Timeout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Prompt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.user}</div>
                          <div className="text-xs text-muted-foreground">{log.userRole}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.template}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">{log.prompt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <span className="capitalize">{log.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.tokensUsed.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{log.responseTime}</TableCell>
                      <TableCell className="font-medium">{log.cost}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>AI Request Details</DialogTitle>
                              <DialogDescription>Full details of the AI API call</DialogDescription>
                            </DialogHeader>
                            {selectedLog && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                                    <p className="font-mono text-sm">{selectedLog.timestamp}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">User</p>
                                    <p className="text-sm">
                                      {selectedLog.user} ({selectedLog.userRole})
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Template</p>
                                    <Badge variant="outline">{selectedLog.template}</Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      {getStatusIcon(selectedLog.status)}
                                      <span className="capitalize text-sm">{selectedLog.status}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tokens Used</p>
                                    <p className="font-mono text-sm">{selectedLog.tokensUsed.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                                    <p className="text-sm">{selectedLog.responseTime}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Cost</p>
                                    <p className="font-medium text-sm">{selectedLog.cost}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-2">Prompt</p>
                                  <div className="rounded-lg bg-muted p-4">
                                    <p className="text-sm font-mono">{selectedLog.prompt}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-2">Response</p>
                                  <div className="rounded-lg bg-muted p-4">
                                    <p className="text-sm font-mono">{selectedLog.response}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
