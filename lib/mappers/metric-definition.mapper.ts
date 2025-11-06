import { MetricDefinition, MetricCategory } from '@/types/models/metric-definition.model';

export const metricDefinitionMapper = {
  toModel: (dto: any): MetricDefinition => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    name: dto.name,
    unit: dto.unit,
    category: dto.category as MetricCategory,
    createdAt: new Date(dto.created_at),
  }),
};