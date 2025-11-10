import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, Workout } from '@/lib/mock-db/database';
import { success, error, notFound } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { z } from 'zod';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/workouts/:id
 */
const getHandler = async (req: NextRequest, { params }: RouteParams) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const workout = database.get<Workout>('workouts', params.id);
    if (!workout) return notFound('Workout');

    return success(workout);
  } catch (err) {
    console.error('Failed to fetch workout:', err);
    return error('Failed to fetch workout', 500);
  }
};

export const GET = withLogging(getHandler);

/**
 * PATCH /api/workouts/:id
 */
const updateWorkoutSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  exercises: z.array(z.any()).optional(),
  type: z.string().optional(),
  difficulty: z.string().optional(),
});

const patchHandler = async (
  req: NextRequest,
  validatedBody: any,
  { params }: RouteParams
) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['trainer', 'admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const workout = database.get<Workout>('workouts', params.id);
    if (!workout) return notFound('Workout');

    // Prevent changing creatorId
    if (validatedBody.creatorId) {
      delete validatedBody.creatorId;
    }

    const updated = database.update('workouts', params.id, validatedBody);

    if (!updated) return error('Failed to update workout', 500);

    return success(updated);
  } catch (err) {
    console.error('Failed to update workout:', err);
    return error('Failed to update workout', 500);
  }
};

export const PATCH = withLogging(withValidation(updateWorkoutSchema, patchHandler));

/**
 * DELETE /api/workouts/:id
 */
const deleteHandler = async (req: NextRequest, { params }: RouteParams) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['trainer', 'admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const workout = database.get<Workout>('workouts', params.id);
    if (!workout) return notFound('Workout');

    const deleted = database.delete('workouts', params.id);
    if (!deleted) return error('Failed to delete workout', 500);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Failed to delete workout:', err);
    return error('Failed to delete workout', 500);
  }
};

export const DELETE = withLogging(deleteHandler);