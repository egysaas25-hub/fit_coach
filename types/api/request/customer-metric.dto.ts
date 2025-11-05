export interface CreateCustomerMetricDto {
  tenant_id: number;
  customer_id: string;
  metric_definition_id: number;
  metric_value: number;
  category: string;
  created_by: number;
}

export interface UpdateCustomerMetricDto {
  metric_value?: number;
  category?: string;
}

export interface CustomerMetricResponseDto {
  id: number;
  tenant_id: number;
  customer_id: string;
  metric_definition_id: number;
  metric_value: number;
  category: string;
  recorded_at: string;
  created_by: number;
}