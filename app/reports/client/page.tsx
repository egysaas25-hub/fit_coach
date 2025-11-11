"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useClients } from '@/lib/hooks/api/useClients';
import { useReports, useGenerateReport, useExportReport } from '@/lib/hooks/api/useReports';
import { ReportType } from '@/types/domain/report';

export default function ClientReportsPage() {
  const { data: clients = [] } = useClients();
  const { data: reports = [] } = useReports();
  const generateReport = useGenerateReport();
  const exportReport = useExportReport();

  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [type, setType] = useState<ReportType>(ReportType.Engagement);

  const filteredReports = reports.filter(r => !selectedClientId || r.title.toLowerCase().includes(selectedClientId.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Client Reports</h1>
          <p className="text-muted-foreground">Generate and export client performance reports</p>
        </div>

        <div className="space-y-6">
          <Card>
        <CardHeader>
          <CardTitle>Client Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm">Client</label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c: any) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm">Report Type</label>
              <Select value={type} onValueChange={(v) => setType(v as ReportType)}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReportType.Engagement}>Engagement</SelectItem>
                  <SelectItem value={ReportType.Sales}>Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => generateReport.mutate(type)} disabled={generateReport.isPending}>Generate Custom Report</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredReports.map((r: any) => (
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
      </main>
    </div>
  );
}
