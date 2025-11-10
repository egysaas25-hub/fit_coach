"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function IngredientsLibraryPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Ingredients Library</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Browse ingredients and nutrition info.</div>
        </CardContent>
      </Card>
    </div>
  );
}
