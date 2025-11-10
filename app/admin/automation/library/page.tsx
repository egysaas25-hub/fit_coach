"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AutomationLibraryPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Workflow Library</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Browse and manage automation workflows.</div>
        </CardContent>
      </Card>
    </div>
  );
}
