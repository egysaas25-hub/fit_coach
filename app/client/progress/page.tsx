"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useClientProgress } from '@/lib/hooks/api/useProgress';
import { useUserStore } from '@/lib/store/user.store';

/**
 * Client Progress Page
 * Follows Architecture Rules:
 * - Rule 1: Component calls hooks only
 * - Uses React Query for server data
 */
export default function ProgressTrackingPage() {
  const { user } = useUserStore();
  const { data: progressData, isLoading, error } = useClientProgress(user?.id || '');

  // Transform weight data for chart
  const weightChartData = progressData?.byMetric.weight.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    weight: typeof entry.value === 'number' ? entry.value : parseFloat(entry.value as string),
  })) || [];

  if (error) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        <h1 className="text-2xl font-bold">Progress Tracking</h1>
        <div className="text-center py-8 text-destructive">
          Error loading progress data
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-2xl font-bold">Progress Tracking</h1>

      <Card>
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading progress data...</div>
          ) : weightChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No weight data available</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Measurement History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading measurements...</div>
          ) : progressData?.byMetric.measurements && progressData.byMetric.measurements.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {progressData.byMetric.measurements.map((measurement) => (
                  <TableRow key={measurement.id}>
                    <TableCell>{new Date(measurement.date).toLocaleDateString()}</TableCell>
                    <TableCell className="capitalize">{measurement.metric}</TableCell>
                    <TableCell>{measurement.value}</TableCell>
                    <TableCell>{measurement.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No measurements recorded</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}