// lib/api/services/report.service.ts
import { Report, ReportType } from '@/types/domain/report';

export class ReportService {
  async getReports(): Promise<Report[]> {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      return data as Report[];
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    }
  }

  async generateReport(type: ReportType): Promise<Report> {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await response.json();
      return data as Report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('Failed to generate report');
    }
  }

  async exportReport(reportId: string): Promise<Blob> {
    try {
      const response = await fetch(`/api/reports/${reportId}/export`);
      return await response.blob();
    } catch (error) {
      console.error('Error exporting report:', error);
      throw new Error('Failed to export report');
    }
  }
}