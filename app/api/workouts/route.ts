import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, Workout } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';

// Assume the Workout model in database.ts will be expanded to include these fields:
// interface Workout extends BaseEntity {
//   name: string;
//   description?: string;
//   type?: string; // e.g., 'strength', 'cardio'
//   difficulty?: string; // e.g., 'beginner', 'intermediate'
//   exercises: any[]; // A list of exercises
//   creatorId: string; // ID of the trainer/admin who created it
// }

/**
 * GET /api/workouts
 * Retrieves a list of workout programs.
 * - All authenticated users can view workouts.
 * - Filters can be applied.
 */
export async function GET(req: NextRequest) {
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
}

/**
 * POST /api/workouts
 * Creates a new workout program.
 * - Accessible by Trainers and Admins.
 */
export async function POST(req: NextRequest) {
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
    const body = await req.json();

    // Basic validation (use Zod in a real app)
    if (!body.name || !Array.isArray(body.exercises) || body.exercises.length === 0) {
      return error('Workout name and a list of exercises are required.', 400);
    }

    // In a real implementation, you might also assign this workout to one or more clients.
    const newWorkoutData: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'> = {
        name: body.name,
        ...body, // includes description, type, difficulty, exercises etc.
        creatorId: user.id,
    };

    const newWorkout = database.create('workouts', newWorkoutData);

    return success(newWorkout, 201);
  } catch (err) {
    console.error('Failed to create workout:', err);
    return error('An unexpected error occurred while creating the workout.', 500);
  }
}
