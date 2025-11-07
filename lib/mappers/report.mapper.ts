// lib/mappers/report.mapper.ts
import { Report, ReportType, ReportStatus, ReportMetrics } from '@/types/domain/report';

interface RawReport {
  report_id: string;
  title: string;
  type: string;
  status: string;
  metrics: Record<string, number | string>;
  created_at: string;
  updated_at: string;
}

export class ReportMapper {
  static toDomainReport(raw: RawReport): Report {
    return {
      id: raw.report_id,
      title: raw.title,
      type: raw.type as ReportType,
      status: raw.status as ReportStatus,
      metrics: raw.metrics as ReportMetrics,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }

  static toDomainReports(rawReports: RawReport[]): Report[] {
    return rawReports.map(this.toDomainReport);
  }
}