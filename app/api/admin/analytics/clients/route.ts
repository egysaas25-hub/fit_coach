import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { success, error } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/analytics/clients
 * Get client analytics (Admin only)
 */
export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    const clients = await prisma.customers.findMany({
      where: {
        tenant_id: tenantId
      }
    });

    const workoutLogs = await prisma.progress_tracking.findMany({
      where: {
        tenant_id: tenantId
      }
    });

    const nutritionLogs = await prisma.progress_tracking.findMany({
      where: {
        tenant_id: tenantId
      }
    });

    // Client activity analysis
    const clientActivity = clients.map(client => {
      const clientWorkouts = workoutLogs.filter(w => w.customer_id === client.id);
      const clientNutrition = nutritionLogs.filter(n => n.customer_id === client.id);
      const clientProgress = workoutLogs.filter(p => p.customer_id === client.id);

      return {
        clientId: client.id.toString(),
        name: `${client.first_name || ''} ${client.last_name || ''}`.trim(),
        workoutsLogged: clientWorkouts.length,
        nutritionLogged: clientNutrition.length,
        progressEntries: clientProgress.length,
        lastActivity:
          clientWorkouts.length > 0
            ? clientWorkouts[clientWorkouts.length - 1].recorded_at
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
}