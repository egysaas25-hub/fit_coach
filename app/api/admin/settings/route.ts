import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

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
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    return success(appSettings);
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    return error('Failed to fetch settings', 500);
  }
}

/**
 * PATCH /api/admin/settings
 * Update application settings (Admin only)
 */
export async function PATCH(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['super-admin']); // Only super-admin
  if (roleCheck) return roleCheck;

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
}