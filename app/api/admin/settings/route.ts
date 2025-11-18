import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth.middleware';
import { success, error } from '@/lib/utils/response';

// In-memory settings store (use database in production)
let appSettings = {
  general: {
    appName: 'FitCoach Pro',
    maintenanceMode: false,
    signupEnabled: true,
    maxClientsPerTrainer: 50,
  },
  email: {
    enabled: true,
    provider: 'sendgrid',
    fromEmail: 'noreply@fitcoach.com',
  },
  features: {
    appointments: true,
    messaging: true,
    progressTracking: true,
    nutritionPlans: true,
  },
  limits: {
    maxWorkoutsPerClient: 100,
    maxNutritionPlansPerClient: 50,
    maxFileSize: 5242880, // 5MB
  },
};

/**
 * GET /api/admin/settings
 * Get application settings (Admin only)
 */
export async function GET(req: NextRequest) {
  return requireRole(['admin', 'super-admin'], req, async (authReq) => {
    try {
      return success(appSettings);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      return error('Failed to fetch settings', 500);
    }
  });
}

/**
 * PATCH /api/admin/settings
 * Update application settings (Admin only)
 */
export async function PATCH(req: NextRequest) {
  return requireRole(['super-admin'], req, async (authReq) => {
    try {
      const body = await req.json();

      // Deep merge settings
      appSettings = {
        general: { ...appSettings.general, ...(body.general || {}) },
        email: { ...appSettings.email, ...(body.email || {}) },
        features: { ...appSettings.features, ...(body.features || {}) },
        limits: { ...appSettings.limits, ...(body.limits || {}) },
      };

      return success(appSettings);
    } catch (err) {
      console.error('Failed to update settings:', err);
      return error('Failed to update settings', 500);
    }
  });
}