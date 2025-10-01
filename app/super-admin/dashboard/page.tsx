"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockData = {
  tenants: 120,
  activeSubscriptions: 1000,
  monthlyRecurringRevenue: 50000,
  churnRate: '5%',
  chartData: [
    { name: 'Jan', tenants: 65, revenue: 2400 },
    { name: 'Feb', tenants: 59, revenue: 2210 },
    { name: 'Mar', tenants: 80, revenue: 2290 },
    { name: 'Apr', tenants: 81, revenue: 2000 },
    { name: 'May', tenants: 56, revenue: 2181 },
    { name: 'Jun', tenants: 55, revenue: 2500 },
    { name: 'Jul', tenants: 40, revenue: 2100 },
  ],
};

export default function SuperAdminDashboard() {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-2xl font-bold">Super-Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockData.tenants}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockData.activeSubscriptions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>MRR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${mockData.monthlyRecurringRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockData.churnRate}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>System Metrics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tenants" fill="#8884d8" name="New Tenants" />
              <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}