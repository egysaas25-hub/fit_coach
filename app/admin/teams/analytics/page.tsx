"use client"

import { useState } from "react"
import KPICard from "@/components/workspace/kpi-card"
import DataTable from "@/components/workspace/data-table"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-foreground mb-2">Team Analytics</h1>
          <p className="text-muted-foreground">Performance dashboard and workload distribution</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Avg Response Time"
          value={avgResponseTime}
          icon="⏱️"
          subtext="Team average"
          trend={{ value: 5, isPositive: true }}
        />
        <KPICard
          title="SLA Compliance"
          value={`${avgSLACompliance}%`}
          icon="✓"
          subtext="Target: 90%"
          trend={{ value: 2, isPositive: true }}
        />
        <KPICard title="Total Hours Logged" value={totalHoursLogged} icon="⏲️" subtext="This week" />
        <KPICard title="Active Trainers" value={mockTrainers.length} icon="👥" subtext="On duty" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Line Chart */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold font-poppins text-foreground mb-4">Trainer Activity (This Week)</h2>
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
        </div>

        {/* Workload Pie Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold font-poppins text-foreground mb-4">Workload Distribution</h2>
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
        </div>
      </div>

      {/* Workload Bar Chart */}
      <div className="card">
        <h2 className="text-lg font-semibold font-poppins text-foreground mb-4">Workload by Trainer</h2>
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
      </div>

      {/* Team Performance Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold font-poppins text-foreground">Team Performance</h2>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-secondary" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-background border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:border-primary"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>

        <DataTable<Trainer>
          columns={[
            {
              key: "name",
              label: "Trainer Name",
              sortable: true,
            },
            {
              key: "assignedClients",
              label: "Assigned Clients",
              sortable: true,
            },
            {
              key: "avgResponseTime",
              label: "Response Time Avg",
              sortable: true,
            },
            {
              key: "slaCompliance",
              label: "SLA Compliance %",
              sortable: true,
              render: (compliance) => (
                <div className="flex items-center gap-2">
                  <span
                    className={
                      compliance >= 95 ? "text-primary" : compliance >= 90 ? "text-warning" : "text-destructive"
                    }
                  >
                    {compliance}%
                  </span>
                  <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        compliance >= 95 ? "bg-primary" : compliance >= 90 ? "bg-warning" : "bg-destructive"
                      }`}
                      style={{ width: `${compliance}%` }}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: "hoursLogged",
              label: "Hours Logged",
              sortable: true,
            },
            {
              key: "id",
              label: "Action",
              render: () => (
                <button className="text-primary hover:text-primary/80 text-sm font-medium">View Details</button>
              ),
            },
          ]}
          data={mockTrainers}
        />
      </div>
    </div>
  )
}
