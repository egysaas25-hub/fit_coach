import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withLogging } from '@/lib/middleware/logging.middleware';

/**
 * GET /api/admin/analytics/trainers
 * Get trainer analytics (Admin only)
 */
const getHandler = async (req: NextRequest) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const trainers = database.getAll('trainers');
    const clients = database.getAll('clients');
    const workouts = database.getAll('workouts');
    const nutritionPlans = database.getAll('nutritionPlans');
    const appointments = database.getAll('appointments');

    // Trainer performance analysis
    const trainerStats = trainers.map((trainer: any) => {
      const trainerClients = clients.filter((c: any) => c.trainerId === trainer.id);
      const trainerWorkouts = workouts.filter((w: any) => w.creatorId === trainer.id);
      const trainerNutrition = nutritionPlans.filter(
        (n: any) => n.creatorId === trainer.id
      );
      const trainerAppointments = appointments.filter(
        (a: any) => a.trainerId === trainer.id
      );

      return {
        trainerId: trainer.id,
        name: trainer.name,
        clientCount: trainerClients.length,
        workoutsCreated: trainerWorkouts.length,
        nutritionPlansCreated: trainerNutrition.length,
        totalAppointments: trainerAppointments.length,
completedAppointments: trainerAppointments.filter(
          (a: any) => a.status === 'completed'
        ).length,
      };
    });

    // Sort by client count
    trainerStats.sort((a, b) => b.clientCount - a.clientCount);

    const analytics = {
      totalTrainers: trainers.length,
      trainerPerformance: trainerStats,
      averageClientsPerTrainer:
        trainers.length > 0 ? clients.length / trainers.length : 0,
      totalWorkoutsCreated: workouts.length,
      totalNutritionPlansCreated: nutritionPlans.length,
      workload: {
        mostClients: trainerStats[0] || null,
        leastClients: trainerStats[trainerStats.length - 1] || null,
        balanced: trainerStats.filter(
          (t) => t.clientCount >= 3 && t.clientCount <= 10
        ).length,
      },
    };

    return success(analytics);
  } catch (err) {
    console.error('Failed to fetch trainer analytics:', err);
    return error('Failed to fetch trainer analytics', 500);
  }
};

export const GET = withLogging(getHandler);