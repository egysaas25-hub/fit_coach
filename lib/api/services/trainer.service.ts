// lib/api/services/trainer.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';
import { Client } from '@/types/domain/client.model';

/**
 * Trainer Service
 * Rule 5: Service calls apiClient
 * Rule 6: Uses endpoints
 */

export interface TrainerStats {
  totalClients: number;
  activeSessions: number;
  clientProgress: number;
  revenue: number;
}

export interface TrainerDashboardData {
  stats: TrainerStats;
  recentClients: Client[];
  recentActivity: Array<{
    id: string;
    clientId: string;
    clientName: string;
    action: string;
    timestamp: string;
    type: string;
  }>;
}

export class TrainerService {
  /**
   * Get trainer dashboard data
   * Note: This endpoint doesn't exist yet in backend
   * Returns mock structure for now
   */
  async getDashboardData(trainerId: string): Promise<TrainerDashboardData> {
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
  }

  /**
   * Get trainer's clients
   */
  async getClients(trainerId: string): Promise<Client[]> {
    const response = await apiClient.get<ApiResponse<Client[]>>(
      `${endpoints.client}?trainerId=${trainerId}`
    );
    return response.data.data;
  }
}

export const trainerService = new TrainerService();
