"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CustomExercisesPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Custom Exercises</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Create and manage your custom exercises here.</div>
        </CardContent>
      </Card>
    </div>
  );
}
