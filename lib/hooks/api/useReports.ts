// lib/hooks/api/useReports.ts
import { useState, useEffect, useCallback } from 'react';
import { ReportService } from '@/lib/api/services/report.service';
import { Report, ReportType } from '@/types/domain/report';

const reportService = new ReportService();

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reportService.getReports();
      setReports(data);
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, error, refetch: fetchReports };
}

export function useGenerateReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (type: ReportType) => {
    setLoading(true);
    try {
      const report = await reportService.generateReport(type);
      return report;
    } catch (err) {
      setError('Failed to generate report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateReport, loading, error };
}

export function useExportReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportReport = useCallback(async (reportId: string) => {
    setLoading(true);
    try {
      const blob = await reportService.exportReport(reportId);
      return blob;
    } catch (err) {
      setError('Failed to export report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { exportReport, loading, error };
}