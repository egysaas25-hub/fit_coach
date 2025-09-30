"use client"

import { Card } from "@/components/ui/card"
import { Users, TrendingUp, Clock, CheckCircle2 } from "lucide-react"

export function ConsultationManagement() {
  const subscriptionTiers = [
    {
      tier: "Basic",
      activeUsers: 45,
      revenue: "$2,250",
      growth: "+12%",
      churnRate: "3.2%",
    },
    {
      tier: "Premium",
      activeUsers: 32,
      revenue: "$4,800",
      growth: "+18%",
      churnRate: "2.1%",
    },
    {
      tier: "Elite",
      activeUsers: 18,
      revenue: "$5,400",
      growth: "+25%",
      churnRate: "1.5%",
    },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Consultation Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track consultation metrics and client engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Consultations</p>
              <p className="text-3xl font-bold text-foreground mt-1">218</p>
              <p className="text-sm text-emerald-500 mt-1">+15% this month</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-foreground mt-1">186</p>
              <p className="text-sm text-muted-foreground mt-1">85% completion rate</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Duration</p>
              <p className="text-3xl font-bold text-foreground mt-1">45min</p>
              <p className="text-sm text-muted-foreground mt-1">Per consultation</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-3xl font-bold text-foreground mt-1">$12.4K</p>
              <p className="text-sm text-emerald-500 mt-1">+22% growth</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Subscription Analytics */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Subscription Analytics</h3>
            <p className="text-sm text-muted-foreground">Performance metrics by subscription tier</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tier</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Active Users</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Monthly Revenue</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Growth</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Churn Rate</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionTiers.map((tier, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{tier.tier}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground text-right">{tier.activeUsers}</td>
                    <td className="py-3 px-4 text-sm text-foreground text-right">{tier.revenue}</td>
                    <td className="py-3 px-4 text-sm text-emerald-500 text-right">{tier.growth}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground text-right">{tier.churnRate}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Consultation Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Monthly Consultations</h3>
              <p className="text-sm text-muted-foreground">Consultation volume over time</p>
            </div>
            <div className="h-48 flex items-end gap-2">
              {[65, 72, 68, 78, 85, 82, 90, 88, 95, 92, 98, 96].map((height, i) => (
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

        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Client Satisfaction</h3>
              <p className="text-sm text-muted-foreground">Average satisfaction scores</p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Communication", score: 4.8 },
                { label: "Expertise", score: 4.9 },
                { label: "Results", score: 4.7 },
                { label: "Value", score: 4.6 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground font-medium">{item.score}/5.0</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
