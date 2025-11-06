// types/domain/report.ts
export interface Report {
  id: string;
  title: string; // e.g., 'Revenue Trends'
  type: ReportType;
  status: ReportStatus;
  metrics: ReportMetrics;
  createdAt: string;
  updatedAt: string;
}

export enum ReportType {
  Revenue = 'Revenue',
  UserGrowth = 'UserGrowth',
  Engagement = 'Engagement',
  Sales = 'Sales',
}

export enum ReportStatus {
  Generating = 'Generating',
  Completed = 'Completed',
  Failed = 'Failed',
}

export interface ReportMetrics {
  [key: string]: number | string; // e.g., { totalUsers: 119, revenue: 15000 }
}