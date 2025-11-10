"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NutritionAIBuilderPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>AI Meal Builder</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">Build meal plans using AI suggestions.</div>
          <Button disabled>Build with AI (coming soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
