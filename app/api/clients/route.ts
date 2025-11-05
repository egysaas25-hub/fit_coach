
import { clientMapper } from '@/lib/mappers/client.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { Client } from '@/types/domain/client.model';
import { ClientResponseDto } from '@/types/api/request/client.dto';

export const clientService = {
  getAll: async (tenantId?: number): Promise<Client[]> => {
    const url = tenantId ? `${endpoints.client}?tenant_id=${tenantId}` : endpoints.client;
    const { data } = await apiClient.get<ClientResponseDto[]>(url);
    return data.map(clientMapper.toModel);
  },
  getById: async (id: string): Promise<Client> => {
    const { data } = await apiClient.get<ClientResponseDto>(`${endpoints.client}/${id}`);
    return clientMapper.toModel(data);
  },
  create: async (model: Partial<Client>): Promise<Client> => {
    const dto = clientMapper.toCreateDto(model);
    const { data } = await apiClient.post<ClientResponseDto>(endpoints.client, dto);
    return clientMapper.toModel(data);
  },
  update: async (id: string, model: Partial<Client>): Promise<Client> => {
    const dto = clientMapper.toCreateDto(model);
    const { data } = await apiClient.put<ClientResponseDto>(`${endpoints.client}/${id}`, dto);
    return clientMapper.toModel(data);
  },
};