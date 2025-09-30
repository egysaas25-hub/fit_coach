"use client"

import { Card } from "@/components/ui/card"
import { Activity, Clock, CheckCircle2 } from "lucide-react"

export function ApiMonitoring() {
  const endpoints = [
    { endpoint: "/api/clients", requests: 3245, successRate: 99.8, avgResponse: 120 },
    { endpoint: "/api/workouts", requests: 2891, successRate: 99.5, avgResponse: 145 },
    { endpoint: "/api/nutrition", requests: 2156, successRate: 98.9, avgResponse: 132 },
    { endpoint: "/api/progress", requests: 1834, successRate: 99.2, avgResponse: 156 },
    { endpoint: "/api/billing", requests: 1523, successRate: 99.9, avgResponse: 98 },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">API Data Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor API performance and usage metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Last 24 Hours</p>
              <p className="text-3xl font-bold text-foreground mt-1">12,487</p>
              <p className="text-sm text-emerald-500 mt-1">+0.4%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-3xl font-bold text-foreground mt-1">99.2%</p>
              <p className="text-sm text-emerald-500 mt-1">+1.08%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Response</p>
              <p className="text-3xl font-bold text-foreground mt-1">145ms</p>
              <p className="text-sm text-muted-foreground mt-1">Response time</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Request Volume */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">API Request Volume</h3>
              <p className="text-sm text-muted-foreground">Requests over time</p>
            </div>
            <div className="h-48 flex items-end gap-2">
              <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="apiGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 150 L 50 120 L 100 130 L 150 90 L 200 100 L 250 70 L 300 80 L 350 50 L 400 60 L 400 200 L 0 200 Z"
                  fill="url(#apiGradient)"
                />
                <polyline
                  points="0,150 50,120 100,130 150,90 200,100 250,70 300,80 350,50 400,60"
                  fill="none"
                  stroke="rgb(16 185 129)"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </Card>

        {/* Response Time Distribution */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Response Time Distribution</h3>
              <p className="text-sm text-muted-foreground">Average response times</p>
            </div>
            <div className="h-48 flex items-end gap-2">
              {[85, 92, 78, 95, 88, 90, 82, 87, 93, 89, 91, 86].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-400"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0-50ms</span>
              <span>50-100ms</span>
              <span>100-200ms</span>
              <span>200ms+</span>
            </div>
          </div>
        </Card>
      </div>

      {/* API Rate Breakdown */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">API Rate Breakdown</h3>
            <p className="text-sm text-muted-foreground">Performance metrics by endpoint</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Endpoint</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Requests</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Success Rate</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Avg Response</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((item, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm text-foreground font-mono">{item.endpoint}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground text-right">
                      {item.requests.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className="text-emerald-500">{item.successRate}%</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground text-right">{item.avgResponse}ms</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                        Healthy
                      </span>
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
