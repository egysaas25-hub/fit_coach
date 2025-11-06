// lib/api/services/tenant.service.ts
import { TenantResponseDto } from '@/types/api/tenant.dto';
import { Tenant } from '@/types/models/tenant.model';
import { tenantMapper } from '@/lib/mappers/tenant.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const tenantService = {
  getAll: async (): Promise<Tenant[]> => {
    const { data } = await apiClient.get<TenantResponseDto[]>(endpoints.tenant);
    return data.map(tenantMapper.toModel);
  },
  getById: async (id: number): Promise<Tenant> => {
    const { data } = await apiClient.get<TenantResponseDto>(`${endpoints.tenant}/${id}`);
    return tenantMapper.toModel(data);
  },
};