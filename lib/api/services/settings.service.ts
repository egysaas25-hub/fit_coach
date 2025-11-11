// lib/api/services/settings.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';
import { AppSettings } from '@/types/lib/api/services/settings.types';

/**
 * Settings Service (Admin)
 * Rule 5: Service calls apiClient
 * Rule 6: Uses endpoints
 */

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
