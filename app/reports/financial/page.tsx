"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useReports, useGenerateReport, useExportReport } from '@/lib/hooks/api/useReports';
import { ReportType } from '@/types/domain/report';

export default function FinancialReportsPage() {
  const { data: reports = [] } = useReports();
  const generateReport = useGenerateReport();
  const exportReport = useExportReport();

  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const filtered = reports.filter((r: any) => {
    const d = new Date(r.createdAt).getTime();
    const fromTs = from ? new Date(from).getTime() : -Infinity;
    const toTs = to ? new Date(to).getTime() : Infinity;
    return d >= fromTs && d <= toTs && (r.type === ReportType.Revenue || r.type === ReportType.Sales);
  });

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Financial Reports</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm">From</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">To</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={() => generateReport.mutate(ReportType.Revenue)} disabled={generateReport.isPending}>Analyze finances</Button>
            </div>
          </div>
          <div className="space-y-2">
            {filtered.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between border border-border rounded-md p-3">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.type} · {new Date(r.createdAt).toLocaleString()}</div>
                </div>
                <Button variant="outline" onClick={async () => {
                  const blob = await exportReport.mutateAsync(r.id);
                  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${r.title}.csv`; a.click(); URL.revokeObjectURL(url);
                }}>Export</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
