import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, Trainer } from '@/lib/mock-db/database';
import { success, error, notFound } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/trainers/:id
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
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
}

/**
 * PATCH /api/trainers/:id
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const trainer = database.get<Trainer>('trainers', params.id);
    if (!trainer) return notFound('Trainer');

    const body = await req.json();
    const updated = database.update('trainers', params.id, body);

    if (!updated) return error('Failed to update trainer', 500);

    const { passwordHash, ...trainerResponse } = updated as any;
    return success(trainerResponse);
  } catch (err) {
    console.error('Failed to update trainer:', err);
    return error('Failed to update trainer', 500);
  }
}

/**
 * DELETE /api/trainers/:id
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
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
}