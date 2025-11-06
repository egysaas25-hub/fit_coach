// lib/api/services/customer-metric.service.ts
import { CustomerMetricResponseDto, CreateCustomerMetricDto } from '@/types/api/customer-metric.dto';
import { CustomerMetric } from '@/types/models/customer-metric.model';
import { customerMetricMapper } from '@/lib/mappers/customer-metric.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const customerMetricService = {
  getAll: async (customerId?: string): Promise<CustomerMetric[]> => {
    const url = customerId ? `${endpoints.customerMetric}?customer_id=${customerId}` : endpoints.customerMetric;
    const { data } = await apiClient.get<CustomerMetricResponseDto[]>(url);
    return data.map(customerMetricMapper.toModel);
  },
  create: async (model: Partial<CustomerMetric>): Promise<CustomerMetric> => {
    const dto = customerMetricMapper.toCreateDto(model);
    const { data } = await apiClient.post<CustomerMetricResponseDto>(endpoints.customerMetric, dto);
    return customerMetricMapper.toModel(data);
  },
};