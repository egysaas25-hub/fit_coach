"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table"

interface Trainer {
  id: string
  name: string
  assignedClients: number
  avgResponseTime: string
  slaCompliance: number
  hoursLogged: number
}

interface ActivityData {
  date: string
  hours: number
  responses: number
}

interface WorkloadData {
  name: string
  clients: number
}

const mockTrainers: Trainer[] = [
  {
    id: "1",
    name: "John Smith",
    assignedClients: 20,
    avgResponseTime: "2.5h",
    slaCompliance: 95,
    hoursLogged: 42,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    assignedClients: 18,
    avgResponseTime: "3.0h",
    slaCompliance: 92,
    hoursLogged: 40,
  },
  {
    id: "3",
    name: "Mike Chen",
    assignedClients: 22,
    avgResponseTime: "2.2h",
    slaCompliance: 98,
    hoursLogged: 45,
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    assignedClients: 19,
    avgResponseTime: "2.8h",
    slaCompliance: 94,
    hoursLogged: 41,
  },
  {
    id: "5",
    name: "David Park",
    assignedClients: 21,
    avgResponseTime: "2.6h",
    slaCompliance: 96,
    hoursLogged: 43,
  },
]

const activityData: ActivityData[] = [
  { date: "Mon", hours: 8.2, responses: 15 },
  { date: "Tue", hours: 8.5, responses: 18 },
  { date: "Wed", hours: 7.9, responses: 14 },
  { date: "Thu", hours: 8.3, responses: 16 },
  { date: "Fri", hours: 8.1, responses: 17 },
  { date: "Sat", hours: 4.2, responses: 6 },
  { date: "Sun", hours: 0, responses: 0 },
]

const workloadData: WorkloadData[] = [
  { name: "John Smith", clients: 20 },
  { name: "Sarah Johnson", clients: 18 },
  { name: "Mike Chen", clients: 22 },
  { name: "Emily Rodriguez", clients: 19 },
  { name: "David Park", clients: 21 },
]

const COLORS = ["#00C26A", "#EAB308", "#F14A4A", "#3B82F6", "#8B5CF6"]

export default function TeamAnalyticsPage() {
  const [dateRange, setDateRange] = useState("week")

  const avgResponseTime = "2.6h"
  const avgSLACompliance = 95
  const totalHoursLogged = 211

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Team Analytics</h1>
            <p className="text-muted-foreground">Performance dashboard and workload distribution</p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgResponseTime}</div>
              <p className="text-xs text-muted-foreground mt-1">Team average</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">SLA Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSLACompliance}%</div>
              <p className="text-xs text-muted-foreground mt-1">Target: 90%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours Logged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoursLogged}</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Trainers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTrainers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">On duty</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Line Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Trainer Activity (This Week)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2D2B" />
                  <XAxis dataKey="date" stroke="#B3B3B3" />
                  <YAxis stroke="#B3B3B3" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1D1B",
                      border: "1px solid #2A2D2B",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke="#00C26A" dot={{ fill: "#00C26A" }} name="Hours Logged" />
                  <Line type="monotone" dataKey="responses" stroke="#EAB308" dot={{ fill: "#EAB308" }} name="Responses" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Workload Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={workloadData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, clients }) => `${name}: ${clients}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="clients"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1D1B",
                      border: "1px solid #2A2D2B",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Workload Bar Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Workload by Trainer</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2D2B" />
                <XAxis dataKey="name" stroke="#B3B3B3" />
                <YAxis stroke="#B3B3B3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1D1B",
                    border: "1px solid #2A2D2B",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                  }}
                />
                <Bar dataKey="clients" fill="#00C26A" name="Assigned Clients" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Performance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Performance</CardTitle>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainer Name</TableHead>
                  <TableHead>Assigned Clients</TableHead>
                  <TableHead>Response Time Avg</TableHead>
                  <TableHead>SLA Compliance %</TableHead>
                  <TableHead>Hours Logged</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTrainers.map((trainer) => (
                  <TableRow key={trainer.id}>
                    <TableCell>{trainer.name}</TableCell>
                    <TableCell>{trainer.assignedClients}</TableCell>
                    <TableCell>{trainer.avgResponseTime}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            trainer.slaCompliance >= 95 ? "text-primary" : trainer.slaCompliance >= 90 ? "text-yellow-500" : "text-destructive"
                          }
                        >
                          {trainer.slaCompliance}%
                        </span>
                        <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              trainer.slaCompliance >= 95 ? "bg-primary" : trainer.slaCompliance >= 90 ? "bg-yellow-500" : "bg-destructive"
                            }`}
                            style={{ width: `${trainer.slaCompliance}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{trainer.hoursLogged}</TableCell>
                    <TableCell>
                      <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium p-0">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}