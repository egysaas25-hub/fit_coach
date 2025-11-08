import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, Workout } from '@/lib/mock-db/database';
import { success, error, notFound } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/workouts/:id
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
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
}

/**
 * PATCH /api/workouts/:id
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['trainer', 'admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const workout = database.get<Workout>('workouts', params.id);
    if (!workout) return notFound('Workout');

    const body = await req.json();
    const updated = database.update('workouts', params.id, body);

    if (!updated) return error('Failed to update workout', 500);

    return success(updated);
  } catch (err) {
    console.error('Failed to update workout:', err);
    return error('Failed to update workout', 500);
  }
}

/**
 * DELETE /api/workouts/:id
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
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
}