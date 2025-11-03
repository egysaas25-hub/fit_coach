// src/types/customer-metrics.ts
export type MetricCategory = 'fitness' | 'health' | 'other';

export interface CustomerMetric {
  id: number;
  tenant_id: number;
  customer_id: string;
  metric_definition_id: number;
  metric_value: number;
  category: MetricCategory;
  recorded_at: string;
  created_by: number;
}

export interface CreateCustomerMetricDto {
  tenant_id: number;
  customer_id: string;
  metric_definition_id: number;
  metric_value: number;
  category: MetricCategory;
  created_by: number;
}

export interface UpdateCustomerMetricDto {
  metric_value?: number;
  category?: MetricCategory;
}