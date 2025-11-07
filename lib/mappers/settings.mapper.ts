// lib/mappers/settings.mapper.ts
import { GeneralSettings, NotificationSettings, SecuritySettings, PreferenceSettings, Integration, IntegrationAccount } from '@/types/domain/settings';

interface RawSettings {
  general: RawGeneralSettings;
  notifications: RawNotificationSettings;
  security: RawSecuritySettings;
  preferences: RawPreferenceSettings;
}

interface RawGeneralSettings {
  company_name: string;
  admin_email: string;
  timezone: string;
  maintenance_mode: boolean;
}

interface RawNotificationSettings {
  email_notifications: boolean;
  new_user_alerts: boolean;
  system_alerts: boolean;
  weekly_reports: boolean;
}

interface RawSecuritySettings {
  two_factor_auth: boolean;
  session_timeout: number;
  login_notifications: boolean;
}

interface RawPreferenceSettings {
  theme: string;
  items_per_page: number;
}

interface RawIntegration {
  integration_id: string;
  name: string;
  description: string;
  status: string;
  last_sync: string;
  enabled: boolean;
}

interface RawIntegrationAccount {
  account_id: string;
  integration_id: string;
  account_identifier: string;
  credentials: Record<string, string>;
  created_at: string;
}

export class SettingsMapper {
  static toDomainSettings(raw: RawSettings): {
    general: GeneralSettings;
    notifications: NotificationSettings;
    security: SecuritySettings;
    preferences: PreferenceSettings;
  } {
    return {
      general: {
        companyName: raw.general.company_name,
        adminEmail: raw.general.admin_email,
        timezone: raw.general.timezone,
        maintenanceMode: raw.general.maintenance_mode,
      },
      notifications: {
        emailNotifications: raw.notifications.email_notifications,
        newUserAlerts: raw.notifications.new_user_alerts,
        systemAlerts: raw.notifications.system_alerts,
        weeklyReports: raw.notifications.weekly_reports,
      },
      security: {
        twoFactorAuth: raw.security.two_factor_auth,
        sessionTimeout: raw.security.session_timeout,
        loginNotifications: raw.security.login_notifications,
      },
      preferences: {
        theme: raw.preferences.theme as PreferenceSettings['theme'],
        itemsPerPage: raw.preferences.items_per_page,
      },
    };
  }

  static toDomainIntegration(raw: RawIntegration): Integration {
    return {
      id: raw.integration_id,
      name: raw.name,
      description: raw.description,
      status: raw.status as Integration['status'],
      lastSync: raw.last_sync,
      enabled: raw.enabled,
    };
  }

  static toDomainIntegrations(rawIntegrations: RawIntegration[]): Integration[] {
    return rawIntegrations.map(this.toDomainIntegration);
  }

  static toDomainIntegrationAccount(raw: RawIntegrationAccount): IntegrationAccount {
    return {
      id: raw.account_id,
      integrationId: raw.integration_id,
      accountId: raw.account_identifier,
      credentials: raw.credentials,
      createdAt: raw.created_at,
    };
  }
}