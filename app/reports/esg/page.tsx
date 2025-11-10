"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReports, useGenerateReport, useExportReport } from '@/lib/hooks/api/useReports';
import { ReportType } from '@/types/domain/report';

export default function EsgReportsPage() {
  const { data: reports = [] } = useReports();
  const generateReport = useGenerateReport();
  const exportReport = useExportReport();

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>ESG / Impact</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => generateReport.mutate(ReportType.UserGrowth)} disabled={generateReport.isPending}>Generate impact</Button>
          <div className="space-y-2">
            {reports.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between border border-border rounded-md p-3">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.type} · {new Date(r.createdAt).toLocaleString()}</div>
                </div>
                <Button variant="outline" onClick={async () => {
                  const blob = await exportReport.mutateAsync(r.id);
                  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${r.title}.csv`; a.click(); URL.revokeObjectURL(url);
                }}>Export ESG</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
