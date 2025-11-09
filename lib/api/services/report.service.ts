// lib/api/services/report.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';
import { Report, ReportType } from '@/types/domain/report';

export class ReportService {
  async getReports(): Promise<Report[]> {
    const response = await apiClient.get<ApiResponse<Report[]>>(endpoints.reports);
    return response.data.data;
  }

  async generateReport(type: ReportType): Promise<Report> {
    const response = await apiClient.post<ApiResponse<Report>>(`${endpoints.reports}/generate`, { type });
    return response.data.data;
  }

  async exportReport(reportId: string): Promise<Blob> {
    const response = await apiClient.get(`${endpoints.reports}/${reportId}/export`, { responseType: 'blob' });
    return response.data as Blob;
  }
}