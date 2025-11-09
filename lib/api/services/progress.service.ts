// lib/api/services/progress.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';

/**
 * Progress Service
 * Rule 5: Service calls apiClient
 * Rule 6: Uses endpoints
 */

export interface ProgressEntry {
  id: string;
  clientId: string;
  metric: string;
  value: number | string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface ProgressData {
  clientId: string;
  total: number;
  byMetric: {
    weight: ProgressEntry[];
    bodyfat: ProgressEntry[];
    measurements: ProgressEntry[];
    photos: ProgressEntry[];
  };
  recent: ProgressEntry[];
}

export interface Activity {
  id: string;
  type: 'workout' | 'nutrition' | 'progress';
  date: string;
  description: string;
  data: any;
}

export interface ActivityData {
  clientId: string;
  activities: Activity[];
  total: number;
  summary: {
    workouts: number;
    nutritionLogs: number;
    progressEntries: number;
  };
}

export class ProgressService {
  /**
   * Get client progress data
   */
  async getClientProgress(clientId: string): Promise<ProgressData> {
    const response = await apiClient.get<ApiResponse<ProgressData>>(
      endpoints.clientProgress(clientId)
    );
    return response.data.data;
  }

  /**
   * Get client activities feed
   */
  async getClientActivities(clientId: string, params?: { limit?: number; from?: string }): Promise<ActivityData> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.from) queryParams.append('from', params.from);

    const url = `${endpoints.clientActivities(clientId)}?${queryParams.toString()}`;
    const response = await apiClient.get<ApiResponse<ActivityData>>(url);
    return response.data.data;
  }
}

export const progressService = new ProgressService();
