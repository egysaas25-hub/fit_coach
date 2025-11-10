import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, Workout } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { z } from 'zod';
import { withValidation } from '@/lib/middleware/validate.middleware';

const createWorkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  exercises: z.array(z.any()),
});
/**
 * GET /api/workouts
 * Retrieves a list of workout programs.
 * - All authenticated users can view workouts.
 * - Filters can be applied.
 */
const getHandler = async (req: NextRequest) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');

    // In a real app, logic would differ based on role.
    // A client might see only their assigned programs.
    // A trainer might see programs they've created.
    let workouts = database.getAll<Workout>('workouts');

    if (type) {
        workouts = workouts.filter((w: any) => w.type === type);
    }
    if (difficulty) {
        workouts = workouts.filter((w: any) => w.difficulty === difficulty);
    }

    return success(workouts);
  } catch (err) {
    console.error('Failed to fetch workouts:', err);
    return error('An unexpected error occurred while fetching workouts.', 500);
  }
};

export const GET = withLogging(getHandler);

/**
 * POST /api/workouts
 * Creates a new workout program.
 * - Accessible by Trainers and Admins.
 */
const postHandler = async (req: NextRequest, validatedBody: any) => {
    ensureDbInitialized();
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
        return authResult;
    }
    const { user } = authResult;

    const roleCheck = requireRole(user, ['trainer', 'admin', 'super-admin']);
    if (roleCheck) {
        return roleCheck;
    }

    try {
        const newWorkoutData: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'> = {
            ...validatedBody,
            creatorId: user.id,
        };

        const newWorkout = database.create('workouts', newWorkoutData);

        return success(newWorkout, 201);
    } catch (err) {
        console.error('Failed to create workout:', err);
        return error('An unexpected error occurred while creating the workout.', 500);
    }
};

export const POST = withValidation(createWorkoutSchema, postHandler);
