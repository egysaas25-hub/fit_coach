import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, Trainer } from '@/lib/mock-db/database';
import { success, error, notFound } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { z } from 'zod';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/trainers/:id
 */
const getHandler = async (req: NextRequest, { params }: RouteParams) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const trainer = database.get<Trainer>('trainers', params.id);
    if (!trainer) return notFound('Trainer');

    const { passwordHash, ...trainerResponse } = trainer;
    return success(trainerResponse);
  } catch (err) {
    console.error('Failed to fetch trainer:', err);
    return error('Failed to fetch trainer', 500);
  }
};

export const GET = withLogging(getHandler);

/**
 * PATCH /api/trainers/:id
 */
const updateTrainerSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
});

const patchHandler = async (
  req: NextRequest,
  validatedBody: any,
  { params }: RouteParams
) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const trainer = database.get<Trainer>('trainers', params.id);
    if (!trainer) return notFound('Trainer');

    // Only allow editable fields
    const updates: Partial<Trainer> = {};
    if (validatedBody.name !== undefined) updates.name = validatedBody.name;
    if (validatedBody.email !== undefined) updates.email = validatedBody.email;

    const updated = database.update('trainers', params.id, updates);
    if (!updated) return error('Failed to update trainer', 500);

    const { passwordHash, ...trainerResponse } = updated;
    return success(trainerResponse);
  } catch (err) {
    console.error('Failed to update trainer:', err);
    return error('Failed to update trainer', 500);
  }
};

export const PATCH = withLogging(withValidation(updateTrainerSchema, patchHandler));

/**
 * DELETE /api/trainers/:id
 */
const deleteHandler = async (req: NextRequest, { params }: RouteParams) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const trainer = database.get<Trainer>('trainers', params.id);
    if (!trainer) return notFound('Trainer');

    const deleted = database.delete('trainers', params.id);
    if (!deleted) return error('Failed to delete trainer', 500);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Failed to delete trainer:', err);
    return error('Failed to delete trainer', 500);
  }
};

export const DELETE = withLogging(deleteHandler);