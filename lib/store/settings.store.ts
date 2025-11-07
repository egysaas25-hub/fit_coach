// lib/store/settings.store.ts
import { create } from 'zustand';
import {
  GeneralSettings,
  NotificationSettings,
  SecuritySettings,
  PreferenceSettings,
  Integration,
  SettingsState,
} from '@/types/domain/settings';
import { useSettings, useIntegrations } from '@/lib/hooks/api/useSettings';

export const useSettingsStore = create<SettingsState>(set => ({
  settings: null,
  integrations: [],
  loading: false,
  error: null,
  fetchSettings: async () => {
    set({ loading: true });
    try {
      const { settings, error } = await useSettings();
      set({ settings, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch settings', loading: false });
    }
  },
  fetchIntegrations: async () => {
    set({ loading: true });
    try {
      const { integrations, error } = await useIntegrations();
      set({ integrations, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch integrations', loading: false });
    }
  },
}));
