"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RenewalAutomationPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Renewal Automation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">Configure automatic renewals and reminders.</div>
          <Button disabled>Configure (coming soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
