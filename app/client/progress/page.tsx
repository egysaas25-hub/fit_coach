"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockProgressData = {
  weight: [
    { date: '2023-01-01', weight: 80 },
    { date: '2023-01-08', weight: 79.5 },
    { date: '2023-01-15', weight: 79 },
    { date: '2023-01-22', weight: 78.5 },
    { date: '2023-01-29', weight: 78 },
  ],
  measurements: [
    { date: '2023-01-01', chest: 100, waist: 80, hips: 100 },
    { date: '2023-01-15', chest: 99, waist: 79, hips: 99 },
    { date: '2023-01-29', chest: 98, waist: 78, hips: 98 },
  ],
};

export default function ProgressTrackingPage() {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-2xl font-bold">Progress Tracking</h1>

      <Card>
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockProgressData.weight}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Measurement History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Chest (cm)</TableHead>
                <TableHead>Waist (cm)</TableHead>
                <TableHead>Hips (cm)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProgressData.measurements.map((measurement) => (
                <TableRow key={measurement.date}>
                  <TableCell>{measurement.date}</TableCell>
                  <TableCell>{measurement.chest}</TableCell>
                  <TableCell>{measurement.waist}</TableCell>
                  <TableCell>{measurement.hips}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}