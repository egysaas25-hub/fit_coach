import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database } from '@/lib/mock-db/database';
import { Client, Workout, NutritionPlan } from '@/types/lib/mock-db/types';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/clients/:id/programs
 * Get all programs (workouts + nutrition) assigned to client
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;
  const { id } = params;

  try {
    // Check if client exists
    const client = database.get<Client>('clients', id);
    if (!client) return notFound('Client');

    // Permission check
    const isOwner = user.role === 'client' && user.id === id;
    const isAssignedTrainer = user.role === 'trainer' && client.trainerId === user.id;
    const isAdmin = user.role === 'admin' || user.role === 'super-admin';

    if (!isOwner && !isAssignedTrainer && !isAdmin) {
      return forbidden("You don't have permission to view this client's programs.");
    }

    // Get workouts assigned to this client or created by their trainer
    let workouts = database.getAll<Workout>('workouts');
    if (client.trainerId) {
      workouts = workouts.filter((w) => w.creatorId === client.trainerId);
    }

    // Get nutrition plans
    let nutritionPlans = database.getAll<NutritionPlan>('nutritionPlans');
    if (client.trainerId) {
      nutritionPlans = nutritionPlans.filter((n) => n.creatorId === client.trainerId);
    }

    const programs = {
      clientId: id,
      workouts: workouts.slice(0, 10), // Limit to 10 most recent
      nutritionPlans: nutritionPlans.slice(0, 5),
      totalWorkouts: workouts.length,
      totalNutritionPlans: nutritionPlans.length,
    };

    return success(programs);
  } catch (err) {
    console.error('Failed to fetch client programs:', err);
    return error('Failed to fetch client programs', 500);
  }
}