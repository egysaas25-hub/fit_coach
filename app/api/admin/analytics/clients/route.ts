import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withLogging } from '@/lib/middleware/logging.middleware';

/**
 * GET /api/admin/analytics/clients
 * Get client analytics (Admin only)
 */
const getHandler = async (req: NextRequest) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const clients = database.getAll('clients');
    const workoutLogs = database.getAll('workoutLogs');
    const nutritionLogs = database.getAll('nutritionLogs');
    const progressEntries = database.getAll('progressEntries');

    // Client activity analysis
    const clientActivity = clients.map((client: any) => {
      const clientWorkouts = workoutLogs.filter((w: any) => w.clientId === client.id);
      const clientNutrition = nutritionLogs.filter((n: any) => n.clientId === client.id);
      const clientProgress = progressEntries.filter((p: any) => p.clientId === client.id);

      return {
        clientId: client.id,
        name: client.name,
        workoutsLogged: clientWorkouts.length,
        nutritionLogged: clientNutrition.length,
        progressEntries: clientProgress.length,
        lastActivity:
          clientWorkouts.length > 0
            ? clientWorkouts[clientWorkouts.length - 1].createdAt
            : null,
      };
    });

    // Sort by activity
    clientActivity.sort((a, b) => b.workoutsLogged - a.workoutsLogged);

    const analytics = {
      totalClients: clients.length,
      mostActiveClients: clientActivity.slice(0, 10),
      inactiveClients: clientActivity.filter((c) => c.workoutsLogged === 0).length,
      averageWorkoutsPerClient:
        clients.length > 0 ? workoutLogs.length / clients.length : 0,
      clientDistribution: {
        withWorkouts: clientActivity.filter((c) => c.workoutsLogged > 0).length,
        withNutrition: clientActivity.filter((c) => c.nutritionLogged > 0).length,
        withProgress: clientActivity.filter((c) => c.progressEntries > 0).length,
      },
    };

    return success(analytics);
  } catch (err) {
    console.error('Failed to fetch client analytics:', err);
    return error('Failed to fetch client analytics', 500);
  }
};

export const GET = withLogging(getHandler);