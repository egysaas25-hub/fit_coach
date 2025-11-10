"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MealTemplatesPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Meal Templates</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">Create and manage meal templates.</div>
          <Button disabled>Create Template (coming soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
