export enum MetricCategory {
  FITNESS = 'fitness',
  HEALTH = 'health',
  OTHER = 'other',
}

export interface CustomerMetric {
  id: number;
  tenantId: number;
  customerId: string;
  metricDefinitionId: number;
  value: number;
  category: MetricCategory;
  recordedAt: Date;
  createdBy: number;
}