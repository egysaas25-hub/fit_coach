"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AutomationTriggersPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Triggers & Events</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Configure triggers and event sources.</div>
        </CardContent>
      </Card>
    </div>
  );
}
