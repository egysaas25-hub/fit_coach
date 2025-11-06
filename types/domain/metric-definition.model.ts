export enum MetricCategory {
  FITNESS = 'fitness',
  HEALTH = 'health',
  OTHER = 'other',
}

export interface MetricDefinition {
  id: number;
  tenantId: number;
  name: string;
  unit: string | null;
  category: MetricCategory;
  createdAt: Date;
}