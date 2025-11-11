// lib/api/services/trainer.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';
import { Client } from '@/types/domain/client.model';
import { TrainerStats, TrainerDashboardData } from '@/types/lib/api/services/trainer.types';
import { Trainer } from '@/types/domain/trainer.model';
import { TrainerResponseDto, CreateTrainerDto } from '@/types/api/request/trainer.dto';
import { trainerMapper } from '@/lib/mappers/trainer.mapper';

/**
 * Trainer Service
 * Rule 5: Service calls apiClient
 * Rule 6: Uses endpoints
 * Rule 3: Uses mappers
 */
export const trainerService = {
  /**
   * Get all trainers
   */
  getAll: async (): Promise<Trainer[]> => {
    const response = await apiClient.get<ApiResponse<TrainerResponseDto[]>>(
      endpoints.trainer
    );
    return response.data.data.map(trainerMapper.toModel);
  },
  
  /**
   * Get trainer by ID
   */
  getById: async (id: string): Promise<Trainer> => {
    const response = await apiClient.get<ApiResponse<TrainerResponseDto>>(
      `${endpoints.trainer}/${id}`
    );
    return trainerMapper.toModel(response.data.data);
  },
  
  /**
   * Create new trainer
   */
  create: async (model: Partial<Trainer>): Promise<Trainer> => {
    const dto: CreateTrainerDto = {
      tenant_id: model.tenantId || 1,
      first_name: model.firstName || null,
      last_name: model.lastName || null,
      email: model.email || '',
      password: 'password123', // Default password
      role: model.role || 'trainer',
    };
    
    const response = await apiClient.post<ApiResponse<TrainerResponseDto>>(
      endpoints.trainer,
      dto
    );
    return trainerMapper.toModel(response.data.data);
  },
  
  /**
   * Update trainer
   */
  update: async (id: string, model: Partial<Trainer>): Promise<Trainer> => {
    const response = await apiClient.patch<ApiResponse<TrainerResponseDto>>(
      `${endpoints.trainer}/${id}`,
      model
    );
    return trainerMapper.toModel(response.data.data);
  },
  
  /**
   * Delete trainer
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${endpoints.trainer}/${id}`);
  },

  /**
   * Get trainer dashboard data
   * Note: This endpoint doesn't exist yet in backend
   * Returns mock structure for now
   */
  getDashboardData: async (trainerId: string): Promise<TrainerDashboardData> => {
    // TODO: Create backend endpoint /api/trainers/:id/dashboard
    // For now, fetch clients assigned to this trainer
    try {
      const clientsResponse = await apiClient.get<ApiResponse<Client[]>>(
        `${endpoints.client}?trainerId=${trainerId}`
      );
      const clients = clientsResponse.data.data;

      return {
        stats: {
          totalClients: clients.length,
          activeSessions: 0,
          clientProgress: 0,
          revenue: 0,
        },
        recentClients: clients.slice(0, 4),
        recentActivity: [],
      };
    } catch (error) {
      // Return empty structure if endpoint doesn't exist
      return {
        stats: {
          totalClients: 0,
          activeSessions: 0,
          clientProgress: 0,
          revenue: 0,
        },
        recentClients: [],
        recentActivity: [],
      };
    }
  },

  /**
   * Get trainer's clients
   */
  getClients: async (trainerId: string): Promise<Client[]> => {
    const response = await apiClient.get<ApiResponse<Client[]>>(
      `${endpoints.client}?trainerId=${trainerId}`
    );
    return response.data.data;
  }
};