import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import {
  database,
  Client,
  WorkoutLog,
  NutritionLog,
  ProgressEntry,
} from '@/lib/mock-db/database';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/clients/:id/activities
 * Get recent activity feed for a client (workouts, nutrition, progress)
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
      return forbidden("You don't have permission to view this client's activities.");
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const fromDate = searchParams.get('from');

    // Get all activities
    const workoutLogs = database.query<WorkoutLog>(
      'workoutLogs',
      (w) => w.clientId === id
    );
    const nutritionLogs = database.query<NutritionLog>(
      'nutritionLogs',
      (n) => n.clientId === id
    );
    const progressEntries = database.query<ProgressEntry>(
      'progressEntries',
      (p) => p.clientId === id
    );

    // Convert to unified activity format
    const activities = [
      ...workoutLogs.map((w) => ({
        id: w.id,
        type: 'workout',
        date: w.dateCompleted,
        description: `Completed workout`,
        data: w,
      })),
      ...nutritionLogs.map((n) => ({
        id: n.id,
        type: 'nutrition',
        date: n.dateLogged,
        description: `Logged nutrition`,
        data: n,
      })),
      ...progressEntries.map((p) => ({
        id: p.id,
        type: 'progress',
        date: p.date,
        description: `Logged ${p.metric}: ${p.value}`,
        data: p,
      })),
    ];

    // Filter by date
    let filteredActivities = activities;
    if (fromDate) {
      const from = new Date(fromDate);
      filteredActivities = activities.filter((a) => new Date(a.date) >= from);
    }

    // Sort by date (newest first)
    filteredActivities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Limit results
    const limitedActivities = filteredActivities.slice(0, limit);

    return success({
      clientId: id,
      activities: limitedActivities,
      total: filteredActivities.length,
      summary: {
        workouts: workoutLogs.length,
        nutritionLogs: nutritionLogs.length,
        progressEntries: progressEntries.length,
      },
    });
  } catch (err) {
    console.error('Failed to fetch client activities:', err);
    return error('Failed to fetch client activities', 500);
  }
}