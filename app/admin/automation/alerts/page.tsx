"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AutomationAlertsPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>AI Alerts Configuration</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Set up AI-driven alerts and notifications.</div>
        </CardContent>
      </Card>
    </div>
  );
}
