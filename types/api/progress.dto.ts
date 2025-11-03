export interface ProgressEntryResponseDto {
  id: number;
  customer_id: string;
  metric_value: number;
  category: string;
  recorded_at: string;
}

export interface ProgressChartDataDto {
  customer_id: string;
  category: string;
  data: { date: string; value: number }[];
}