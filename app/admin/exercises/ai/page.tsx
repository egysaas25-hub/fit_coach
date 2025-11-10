"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ExerciseAIGeneratorPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Exercise AI Generator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">Generate exercise templates with AI.</div>
          <Button disabled>Generate (coming soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
