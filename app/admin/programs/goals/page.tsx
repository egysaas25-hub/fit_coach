"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function GoalTemplatesPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Goal Templates</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Create and manage goal templates.</div>
        </CardContent>
      </Card>
    </div>
  );
}
