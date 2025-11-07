// lib/hooks/api/useSettings.ts
import { useState, useEffect, useCallback } from 'react';
import { SettingsService } from '@/lib/api/services/settings.service';
import { GeneralSettings, NotificationSettings, SecuritySettings, PreferenceSettings, Integration } from '@/types/domain/settings';

const settingsService = new SettingsService();

export function useSettings() {
  const [settings, setSettings] = useState<{
    general: GeneralSettings;
    notifications: NotificationSettings;
    security: SecuritySettings;
    preferences: PreferenceSettings;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, error, refetch: fetchSettings };
}

export function useUpdateSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = useCallback(async (updates: Partial<{
    general: GeneralSettings;
    notifications: NotificationSettings;
    security: SecuritySettings;
    preferences: PreferenceSettings;
  }>) => {
    setLoading(true);
    try {
      await settingsService.updateSettings(updates);
    } catch (err) {
      setError('Failed to update settings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateSettings, loading, error };
}

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await settingsService.getIntegrations();
      setIntegrations(data);
    } catch (err) {
      setError('Failed to fetch integrations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  return { integrations, loading, error, refetch: fetchIntegrations };
}

export function useUpdateIntegration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateIntegration = useCallback(async (integrationId: string, updates: Partial<Integration>) => {
    setLoading(true);
    try {
      const updatedIntegration = await settingsService.updateIntegration(integrationId, updates);
      return updatedIntegration;
    } catch (err) {
      setError('Failed to update integration');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateIntegration, loading, error };
}