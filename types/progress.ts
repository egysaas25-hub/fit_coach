// src/types/progress.ts
export type MetricCategory = 'fitness' | 'health' | 'other';

export interface ProgressEntry {
  id: number;
  customer_id: string;
  metric_value: number;
  category: MetricCategory;
  recorded_at: string;
}

export interface ProgressChartData {
  customer_id: string;
  category: MetricCategory;
  data: { date: string; value: number }[];
}