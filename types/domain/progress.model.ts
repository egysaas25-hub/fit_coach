export enum MetricCategory {
  FITNESS = 'fitness',
  HEALTH = 'health',
  OTHER = 'other',
}

export interface ProgressEntry {
  id: number;
  customerId: string;
  value: number;
  category: MetricCategory;
  recordedAt: Date;
}

export interface ProgressChart {
  customerId: string;
  category: MetricCategory;
  data: { date: Date; value: number }[];
}