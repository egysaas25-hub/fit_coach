import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

/**
 * GET /api/admin/analytics/trainers
 * Get trainer analytics (Admin only)
 */
export async function GET(req: NextRequest) {
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
        completedAppointments: trainerAppointments.filter((a: any) => a.status === 'completed').length,
      };
    }