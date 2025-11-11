"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePrograms } from '@/lib/hooks/api/useProgram';

export default function ProgramsListPage() {
  const { programs, loading, error } = usePrograms();
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Programs</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {loading && <div>Loading...</div>}
          {error && <div className="text-destructive">{error}</div>}
          {programs.map((p) => (
            <div key={p.id} className="flex items-center justify-between border border-border rounded-md p-3">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">Weeks: {p.weekCount}</div>
              </div>
              <Button asChild variant="outline"><a href={`/admin/programs/new?base=${p.id}`}>Duplicate</a></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
