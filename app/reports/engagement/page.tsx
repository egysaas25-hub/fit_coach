"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReports, useGenerateReport } from '@/lib/hooks/api/useReports';
import { ReportType } from '@/types/domain/report';

export default function EngagementReportsPage() {
  const { data: reports = [] } = useReports();
  const generateReport = useGenerateReport();

  const engagement = reports.filter((r: any) => r.type === ReportType.Engagement);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Engagement Reports</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => generateReport.mutate(ReportType.Engagement)} disabled={generateReport.isPending}>View engagement</Button>
          <div className="space-y-2">
            {engagement.map((r: any) => (
              <div key={r.id} className="border border-border rounded-md p-3">
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.type} · {new Date(r.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
