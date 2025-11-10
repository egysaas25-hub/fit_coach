"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useNutritionLogs } from '@/lib/hooks/api/useNutritionLogs';

export default function ClientMealLogsPage() {
  const [clientId, setClientId] = useState('');
  const { data: logs = [], isLoading, error } = (useNutritionLogs as any)(clientId);
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Client Meal Logs</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm">Client</label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="client-1">Client 1</SelectItem>
                  <SelectItem value="client-2">Client 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isLoading && <div>Loading...</div>}
          {error && <div className="text-[#F14A4A]">Failed to load</div>}
          <div className="space-y-2">
            {logs.map((l: any) => (
              <div key={l.id} className="border border-border rounded-md p-3">
                <div className="font-medium">{l.mealType} · {l.calories} kcal</div>
                <div className="text-xs text-muted-foreground">{new Date(l.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
