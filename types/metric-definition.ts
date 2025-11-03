// src/types/metric-definition.ts
export interface MetricDefinition {
  id: number;
  tenant_id: number;
  name: string;
  unit: string | null;
  category: 'fitness' | 'health' | 'other';
  created_at: string;
}