// lib/api/services/settings.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';

/**
 * Settings Service (Admin)
 * Rule 5: Service calls apiClient
 * Rule 6: Uses endpoints
 */

export interface AppSettings {
  general: {
    appName: string;
    maintenanceMode: boolean;
    signupEnabled: boolean;
    maxClientsPerTrainer: number;
  };
  email: {
    enabled: boolean;
    provider: string;
    fromEmail: string;
  };
  features: {
    appointments: boolean;
    messaging: boolean;
    progressTracking: boolean;
    nutritionPlans: boolean;
  };
  limits: {
    maxWorkoutsPerClient: number;
    maxNutritionPlansPerClient: number;
    maxFileSize: number;
  };
}

export class SettingsService {
  /**
   * Get application settings
   */
  async getSettings(): Promise<AppSettings> {
    const response = await apiClient.get<ApiResponse<AppSettings>>(
      endpoints.admin.settings
    );
    return response.data.data;
  }

  /**
   * Update application settings
   */
  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const response = await apiClient.patch<ApiResponse<AppSettings>>(
      endpoints.admin.settings,
      settings
    );
    return response.data.data;
  }
}
