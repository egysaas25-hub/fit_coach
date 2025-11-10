"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function BillingUsageSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Billing & Usage</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Monitor usage and billing details.</div>
        </CardContent>
      </Card>
    </div>
  );
}
