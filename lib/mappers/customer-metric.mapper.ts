import { CustomerMetricResponseDto, CreateCustomerMetricDto } from '@/types/api/customer-metric.dto';
import { CustomerMetric, MetricCategory } from '@/types/models/customer-metric.model';

export const customerMetricMapper = {
  toModel: (dto: CustomerMetricResponseDto): CustomerMetric => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    customerId: dto.customer_id,
    metricDefinitionId: dto.metric_definition_id,
    value: dto.metric_value,
    category: dto.category as MetricCategory,
    recordedAt: new Date(dto.recorded_at),
    createdBy: dto.created_by,
  }),
  toCreateDto: (model: Partial<CustomerMetric>): CreateCustomerMetricDto => ({
    tenant_id: model.tenantId!,
    customer_id: model.customerId!,
    metric_definition_id: model.metricDefinitionId!,
    metric_value: model.value!,
    category: model.category!,
    created_by: model.createdBy!,
  }),
};