import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

/**
 * GET /api/admin/analytics/dashboard
 * Get dashboard analytics (Admin only)
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all data
    const clients = database.getAll('clients');
    const trainers = database.getAll('trainers');
    const workouts = database.getAll('workouts');
    const workoutLogs = database.getAll('workoutLogs');
    const nutritionPlans = database.getAll('nutritionPlans');
    const appointments = database.getAll('appointments');

    // Calculate statistics
    const totalClients = clients.length;
    const totalTrainers = trainers.length;
    const activeClients = clients.filter(
      (c: any) => c.updatedAt >= weekAgo
    ).length;

    const recentWorkouts = workoutLogs.filter(
      (w: any) => w.createdAt >= weekAgo
    ).length;

    const upcomingAppointments = appointments.filter(
      (a: any) => new Date(a.date) >= now && a.status === 'scheduled'
    ).length;

    const completedAppointments = appointments.filter(
      (a: any) => a.status === 'completed'
    ).length;

    // Growth metrics (compare to previous month)
    const clientsThisMonth = clients.filter(
      (c: any) => c.createdAt >= monthAgo
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
}