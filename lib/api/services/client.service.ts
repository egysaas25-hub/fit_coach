// lib/api/services/client.service.ts
import { ClientResponseDto, CreateClientDto } from '@/types/api/request/client.dto';
import { Client } from '@/types/domain/client.model';
import { clientMapper } from '@/lib/mappers/client.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';

/**
 * Client Service
 * Rule 5: Service calls apiClient
 * Rule 6: Uses endpoints
 * Rule 3: Uses mappers
 */
export const clientService = {
  /**
   * Get all clients
   */
  getAll: async (tenantId?: number): Promise<Client[]> => {
    const url = tenantId ? `${endpoints.client}?tenant_id=${tenantId}` : endpoints.client;
    const response = await apiClient.get<ApiResponse<ClientResponseDto[]>>(url);
    return response.data.data.map(clientMapper.toModel);
  },
  
  /**
   * Get client by ID
   */
  getById: async (id: string): Promise<Client> => {
    const response = await apiClient.get<ApiResponse<ClientResponseDto>>(
      `${endpoints.client}/${id}`
    );
    return clientMapper.toModel(response.data.data);
  },
  
  /**
   * Create new client
   */
  create: async (model: Partial<Client>): Promise<Client> => {
    const dto = clientMapper.toCreateDto(model);
    const response = await apiClient.post<ApiResponse<ClientResponseDto>>(
      endpoints.client,
      dto
    );
    return clientMapper.toModel(response.data.data);
  },
  
  /**
   * Update client
   */
  update: async (id: string, model: Partial<Client>): Promise<Client> => {
    const dto = clientMapper.toCreateDto(model);
    const response = await apiClient.put<ApiResponse<ClientResponseDto>>(
      `${endpoints.client}/${id}`,
      dto
    );
    return clientMapper.toModel(response.data.data);
  },
};