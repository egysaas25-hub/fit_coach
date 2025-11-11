/**
 * Settings Service Types
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
  branding?: {
    logoUrl?: string;
    title?: string;
  };
}