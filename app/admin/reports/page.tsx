'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import { useReports } from '@/lib/hooks/api/useReports';
import { Report } from '@/types/domain/report';

export default function AdminReportsPage() {
  const { data: reports = [], isLoading, error } = useReports();
  
  // Extract metrics from reports
  const totalUsers = reports.find(r => r.type === 'UserGrowth')?.metrics.totalUsers || 119;
  const revenue = reports.find(r => r.type === 'Revenue')?.metrics.revenue || 15000;
  const growthRate = reports.find(r => r.type === 'UserGrowth')?.metrics.growthRate || 1.5;
  const activeSessions = reports.find(r => r.type === 'Engagement')?.metrics.activeSessions || 847;
  
  // Mock data for charts (would come from reports in a real implementation)
  const revenueData = [12000, 13500, 14200, 14800, 15200, revenue];
  const userData = [85, 92, 98, 105, 112, totalUsers];
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  
  // Mock sales data (would come from reports in a real implementation)
  const salesData = [
    { user: "Anna Carter", plan: "Premium Monthly", amount: "$49.99", date: "2 hours ago" },
    { user: "John Smith", plan: "Basic Annual", amount: "$299.99", date: "5 hours ago" },
    { user: "Sarah Lee", plan: "Premium Monthly", amount: "$49.99", date: "Yesterday" },
    { user: "Mike Brown", plan: "Premium Annual", amount: "$499.99", date: "2 days ago" },
  ];

  if (error) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading reports</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Overview of platform performance and metrics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : `$${revenue.toLocaleString()}`}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : `+${growthRate}%`}</div>
              <p className="text-xs text-muted-foreground">Month over month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : activeSessions}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Loading chart...</p>
                </div>
              ) : (
                <div className="h-64 flex items-end justify-between gap-2">
                  {revenueData.map((value, i) => {
                    const numValue = typeof value === 'string' ? parseFloat(value) : value;
                    const height = (numValue / 16000) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs font-medium text-muted-foreground">${(numValue / 1000).toFixed(1)}k</div>
                        <div className="w-full bg-primary rounded-t" style={{ height: `${height}%` }} />
                        <div className="text-xs text-muted-foreground">
                          {months[i]}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Loading chart...</p>
                </div>
              ) : (
                <div className="h-64 flex items-end justify-between gap-2">
                  {userData.map((value, i) => {
                    const numValue = typeof value === 'string' ? parseFloat(value) : value;
                    const height = (numValue / 130) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs font-medium text-muted-foreground">{numValue}</div>
                        <div className="w-full bg-accent rounded-t" style={{ height: `${height}%` }} />
                        <div className="text-xs text-muted-foreground">
                          {months[i]}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading sales data...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {salesData.map((sale, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium">{sale.user}</p>
                      <p className="text-xs text-muted-foreground">{sale.plan}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{sale.amount}</p>
                      <p className="text-xs text-muted-foreground">{sale.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}