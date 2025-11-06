"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Users, TrendingUp, Activity } from "lucide-react"

export function ReportsAnalytics() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Track performance metrics and generate custom reports</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-3xl font-bold text-foreground mt-1">125</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-3xl font-bold text-foreground mt-1">100</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Retention</p>
              <p className="text-3xl font-bold text-foreground mt-1">86%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Churn Rate</p>
              <p className="text-3xl font-bold text-foreground mt-1">14%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Revenue</h3>
                <p className="text-sm text-muted-foreground">Monthly revenue tracking</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">$37,000</p>
                <p className="text-sm text-emerald-500">+8%</p>
              </div>
            </div>
            {/* Line Chart Placeholder */}
            <div className="h-48 flex items-end gap-2">
              <div className="flex-1 h-32 bg-emerald-500/20 rounded-t relative">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline
                    points="0,80 20,60 40,70 60,40 80,50 100,20"
                    fill="none"
                    stroke="rgb(16 185 129)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </Card>

        {/* Bar Chart */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Client Growth</h3>
              <p className="text-sm text-muted-foreground">New clients per month</p>
            </div>
            {/* Bar Chart Placeholder */}
            <div className="h-48 flex items-end gap-2">
              {[65, 45, 75, 55, 85, 70, 90, 60, 80, 70, 95, 85].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-emerald-500 rounded-t transition-all hover:bg-emerald-400"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Jan</span>
              <span>Apr</span>
              <span>Jul</span>
              <span>Oct</span>
              <span>Dec</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Report Generation */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Create New Report</h3>
            <p className="text-sm text-muted-foreground">Generate custom reports for your business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name</Label>
              <Input id="report-name" placeholder="Enter report name" className="bg-background border-border" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Select>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter report description"
                className="bg-background border-border min-h-24"
              />
            </div>
          </div>

          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Generate Report</Button>
        </div>
      </Card>

      {/* Recent Reports Table */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recent Reports</h3>
              <p className="text-sm text-muted-foreground">View and download generated reports</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Report Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date Range</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Generated</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Q4 Revenue Report", range: "Oct 1 - Dec 31", date: "2 days ago", status: "Ready" },
                  { name: "Client Retention Analysis", range: "Last 90 days", date: "5 days ago", status: "Ready" },
                  { name: "Monthly Performance", range: "November 2024", date: "1 week ago", status: "Ready" },
                ].map((report, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm text-foreground">{report.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{report.range}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{report.date}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400">
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}
