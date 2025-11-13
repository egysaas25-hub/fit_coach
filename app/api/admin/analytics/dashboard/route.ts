import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { success, error } from '@/lib/utils/response';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/analytics/dashboard
 * Get dashboard analytics (Admin only)
 */
const getHandler = async (req: NextRequest) => {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all data using Prisma
    const clients = await prisma.customers.findMany({
      where: {
        tenant_id: tenantId
      }
    });

    const trainers = await prisma.team_members.findMany({
      where: {
        tenant_id: tenantId,
        role: 'coach'
      }
    });

    const workouts = await prisma.training_plans.findMany({
      where: {
        tenant_id: tenantId
      }
    });

    const workoutLogs = await prisma.progress_tracking.findMany({
      where: {
        tenant_id: tenantId,
        recorded_at: {
          gte: weekAgo
        }
      }
    });

    const nutritionPlans = await prisma.nutrition_plans.findMany({
      where: {
        tenant_id: tenantId
      }
    });

    const appointments = await prisma.checkins.findMany({
      where: {
        tenant_id: tenantId
      }
    });

    // Calculate statistics
    const totalClients = clients.length;
    const totalTrainers = trainers.length;
    const activeClients = clients.filter(
      (c) => c.updated_at >= weekAgo
    ).length;

    const recentWorkouts = workoutLogs.length;

    const upcomingAppointments = appointments.filter(
      (a) => a.checkin_date >= now
    ).length;

    const completedAppointments = appointments.filter(
      (a) => a.reviewed_at !== null
    ).length;

    // Growth metrics (compare to previous month)
    const clientsThisMonth = clients.filter(
      (c) => c.created_at >= monthAgo
    ).length;

    const analytics = {
      overview: {
        totalClients,
        totalTrainers,
        activeClients,
        totalWorkouts: workouts.length,
        totalNutritionPlans: nutritionPlans.length,
      },
      activity: {
        workoutsThisWeek: recentWorkouts,
        upcomingAppointments,
        completedAppointments,
      },
      growth: {
        newClientsThisMonth: clientsThisMonth,
        clientGrowthRate: totalClients > 0 ? (clientsThisMonth / totalClients) * 100 : 0,
      },
      engagement: {
        avgWorkoutsPerClient: totalClients > 0 ? workoutLogs.length / totalClients : 0,
        avgClientsPerTrainer: totalTrainers > 0 ? totalClients / totalTrainers : 0,
      },
    };

    return success(analytics);
  } catch (err) {
    console.error('Failed to fetch dashboard analytics:', err);
    return error('Failed to fetch dashboard analytics', 500);
  }
};

export const GET = withLogging(getHandler);