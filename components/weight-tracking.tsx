"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const weightData = [
  { month: "Jan", weight: 160 },
  { month: "Feb", weight: 158 },
  { month: "Mar", weight: 162 },
  { month: "Apr", weight: 157 },
  { month: "May", weight: 159 },
  { month: "Jun", weight: 155 },
]

export function WeightTracking() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Weight Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-1">Weight Over Time</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold">155 lbs</p>
            <span className="text-sm font-medium text-primary">-3%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Last 6 Months</p>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[150, 165]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
