import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { database, WorkoutLog } from '@/lib/mock-db/database';
import { success, error, forbidden } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

// Assume the WorkoutLog model in database.ts will be expanded to include these fields:
// interface WorkoutLog extends BaseEntity {
//   clientId: string;
//   workoutId: string;
//   dateCompleted: Date;
//   performanceMetrics: any; // e.g., { exerciseId: { sets: [{ reps: 10, weight: 50 }] } }
// }

/**
 * GET /api/workouts/logs
 * Retrieves workout logs.
 * - A client can get their own logs.
 * - A trainer/admin can get logs for a specific client using a query parameter.
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { user } = authResult;
  const { searchParams } = new URL(req.url);

  let clientId = searchParams.get('clientId');

  if (user.role === 'client') {
    // Clients can only access their own logs
    clientId = user.id;
  } else if (!clientId) {
    return error('A clientId query parameter is required for trainers and admins.', 400);
  }

  // In a real app, a trainer should only be able to view logs of their assigned clients.
  // We'll skip that check here for simplicity in the mock setup.

  try {
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

    let logs = database.query<WorkoutLog>('workoutLogs', (log) => log.clientId === clientId);

    if (fromDate) {
        logs = logs.filter((log: any) => new Date(log.dateCompleted) >= new Date(fromDate));
    }
    if (toDate) {
        logs = logs.filter((log: any) => new Date(log.dateCompleted) <= new Date(toDate));
    }

    return success(logs);
  } catch (err) {
    console.error('Failed to fetch workout logs:', err);
    return error('An unexpected error occurred while fetching workout logs.', 500);
  }
}

/**
 * POST /api/workouts/logs
 * Logs a completed workout for the authenticated client.
 */
export async function POST(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { user } = authResult;

  // Only clients can log workouts for themselves
  if (user.role !== 'client') {
    return forbidden('Only clients can log workouts.');
  }

  try {
    const body = await req.json();

    // Basic validation
    if (!body.workoutId) {
      return error('workoutId is required to log a workout.', 400);
    }

    const newLogData: Omit<WorkoutLog, 'id' | 'createdAt' | 'updatedAt'> = {
        clientId: user.id,
        workoutId: body.workoutId,
        dateCompleted: new Date(),
        ...body, // includes performanceMetrics etc.
    };

    const newLog = database.create('workoutLogs', newLogData);

    return success(newLog, 201);
  } catch (err) {
    console.error('Failed to create workout log:', err);
    return error('An unexpected error occurred while creating the workout log.', 500);
  }
}
