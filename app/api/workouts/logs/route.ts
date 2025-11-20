import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error, forbidden } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

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
  try {
    const session = await getSession(req);
    const { user } = session;
    const { searchParams } = new URL(req.url);

    let clientId = searchParams.get('clientId');

    if (user.role === 'client') {
      // Clients can only access their own logs
      clientId = user.id.toString();
    } else if (!clientId) {
      return error('A clientId query parameter is required for trainers and admins.', 400);
    }

    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

    // Build where clause for date filtering
    const whereClause: any = {
      tenant_id: BigInt(user.tenant_id),
      customer_id: BigInt(clientId),
    };

    if (fromDate) {
      whereClause.recorded_at = { ...whereClause.recorded_at, gte: new Date(fromDate) };
    }
    if (toDate) {
      whereClause.recorded_at = { ...whereClause.recorded_at, lte: new Date(toDate) };
    }

    // Query progress_tracking for workout completion data
    // Since workout_logs table exists in migration but not schema, we'll use progress_tracking
    const logs = await prisma.progress_tracking.findMany({
      where: {
        ...whereClause,
        workout_done: true, // Only entries where workout was completed
      },
      orderBy: { recorded_at: 'desc' },
      select: {
        id: true,
        customer_id: true,
        recorded_at: true,
        workout_done: true,
        notes: true,
      },
    });

    // Transform to expected workout log format
    const transformedLogs = logs.map(log => ({
      id: log.id.toString(),
      clientId: log.customer_id.toString(),
      workoutId: 'general', // Since we don't have specific workout IDs in progress_tracking
      dateCompleted: log.recorded_at,
      performanceMetrics: {}, // Empty for now, could be stored in notes as JSON
      notes: log.notes,
    }));

    return success(transformedLogs);
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
  try {
    const session = await getSession(req);
    const { user } = session;

    // Only clients can log workouts for themselves
    if (user.role !== 'client') {
      return forbidden('Only clients can log workouts.');
    }

    const body = await req.json();

    // Basic validation
    if (!body.workoutId) {
      return error('workoutId is required to log a workout.', 400);
    }

    // Create workout log entry in progress_tracking
    const newLog = await prisma.progress_tracking.create({
      data: {
        tenant_id: BigInt(user.tenant_id),
        customer_id: BigInt(user.id),
        recorded_at: body.dateCompleted ? new Date(body.dateCompleted) : new Date(),
        workout_done: true,
        notes: body.notes || `Completed workout: ${body.workoutId}`,
      },
      select: {
        id: true,
        customer_id: true,
        recorded_at: true,
        workout_done: true,
        notes: true,
      },
    });

    // Transform to expected format
    const transformedLog = {
      id: newLog.id.toString(),
      clientId: newLog.customer_id.toString(),
      workoutId: body.workoutId,
      dateCompleted: newLog.recorded_at,
      performanceMetrics: body.performanceMetrics || {},
      notes: newLog.notes,
    };

    return success(transformedLog, 201);
  } catch (err) {
    console.error('Failed to create workout log:', err);
    return error('An unexpected error occurred while creating the workout log.', 500);
  }
}
