// types/domain/settings.ts
export interface GeneralSettings {
  companyName: string;
  adminEmail: string;
  timezone: string; // e.g., 'UTC', 'EST'
  maintenanceMode: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  newUserAlerts: boolean;
  systemAlerts: boolean;
  weeklyReports: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number; // minutes
  loginNotifications: boolean;
}

export interface PreferenceSettings {
  theme: 'light' | 'dark' | 'system';
  itemsPerPage: number; // e.g., 10, 20, 50
}

export interface Integration {
  id: string;
  name: string; // e.g., 'Stripe'
  description: string;
  status: 'Connected' | 'Not Connected';
  lastSync: string;
  enabled: boolean;
}

export interface IntegrationAccount {
  id: string;
  integrationId: string;
  accountId: string;
  credentials: Record<string, string>;
  createdAt: string;
}

export interface UIState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export interface SettingsState {
  settings: {
    general: GeneralSettings;
    notifications: NotificationSettings;
    security: SecuritySettings;
    preferences: PreferenceSettings;
  } | null;
  integrations: Integration[];
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  fetchIntegrations: () => Promise<void>;
}