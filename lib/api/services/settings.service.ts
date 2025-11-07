// lib/api/services/settings.service.ts
import { GeneralSettings, NotificationSettings, SecuritySettings, PreferenceSettings, Integration } from '@/types/domain/settings';

export class SettingsService {
  async getSettings(): Promise<{
    general: GeneralSettings;
    notifications: NotificationSettings;
    security: SecuritySettings;
    preferences: PreferenceSettings;
  }> {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw new Error('Failed to fetch settings');
    }
  }

  async updateSettings(updates: Partial<{
    general: GeneralSettings;
    notifications: NotificationSettings;
    security: SecuritySettings;
    preferences: PreferenceSettings;
  }>): Promise<void> {
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new Error('Failed to update settings');
    }
  }

  async getIntegrations(): Promise<Integration[]> {
    try {
      const response = await fetch('/api/integrations');
      const data = await response.json();
      return data as Integration[];
    } catch (error) {
      console.error('Error fetching integrations:', error);
      throw new Error('Failed to fetch integrations');
    }
  }

  async updateIntegration(integrationId: string, updates: Partial<Integration>): Promise<Integration> {
    try {
      const response = await fetch(`/api/integrations/${integrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      return data as Integration;
    } catch (error) {
      console.error('Error updating integration:', error);
      throw new Error('Failed to update integration');
    }
  }
}