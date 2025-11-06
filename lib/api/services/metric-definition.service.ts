// lib/api/services/metric-definition.service.ts
import { MetricDefinitionResponseDto } from '@/types/api/metric-definition.dto';
import { MetricDefinition } from '@/types/models/metric-definition.model';
import { metricDefinitionMapper } from '@/lib/mappers/metric-definition.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const metricDefinitionService = {
  getAll: async (tenantId?: number): Promise<MetricDefinition[]> => {
    const url = tenantId ? `${endpoints.metricDefinition}?tenant_id=${tenantId}` : endpoints.metricDefinition;
    const { data } = await apiClient.get<MetricDefinitionResponseDto[]>(url);
    return data.map(metricDefinitionMapper.toModel);
  },
  getById: async (id: number): Promise<MetricDefinition> => {
    const { data } = await apiClient.get<MetricDefinitionResponseDto>(`${endpoints.metricDefinition}/${id}`);
    return metricDefinitionMapper.toModel(data);
  },
};