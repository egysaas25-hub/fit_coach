import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { database, NutritionLog } from '@/lib/mock-db/database';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/nutrition/logs/:id
 * Get a specific nutrition log
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const log = database.get<NutritionLog>('nutritionLogs', params.id);
    if (!log) return notFound('Nutrition log');

    // Permission check - clients can only see their own logs
    if (user.role === 'client' && log.clientId !== user.id) {
      return forbidden("You don't have permission to view this nutrition log.");
    }

    return success(log);
  } catch (err) {
    console.error('Failed to fetch nutrition log:', err);
    return error('Failed to fetch nutrition log', 500);
  }
}

/**
 * PATCH /api/nutrition/logs/:id
 * Update a nutrition log
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const log = database.get<NutritionLog>('nutritionLogs', params.id);
    if (!log) return notFound('Nutrition log');

    // Permission check - clients can only update their own logs
    if (user.role === 'client' && log.clientId !== user.id) {
      return forbidden("You don't have permission to update this nutrition log.");
    }

    const body = await req.json();

    // Don't allow changing planId or clientId
    delete body.planId;
    delete body.clientId;

    const updated = database.update('nutritionLogs', params.id, body);
    if (!updated) return error('Failed to update nutrition log', 500);

    return success(updated);
  } catch (err) {
    console.error('Failed to update nutrition log:', err);
    return error('Failed to update nutrition log', 500);
  }
}

/**
 * DELETE /api/nutrition/logs/:id
 * Delete a nutrition log
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const log = database.get<NutritionLog>('nutritionLogs', params.id);
    if (!log) return notFound('Nutrition log');

    // Permission check - clients can only delete their own logs
    if (user.role === 'client' && log.clientId !== user.id) {
      return forbidden("You don't have permission to delete this nutrition log.");
    }

    const deleted = database.delete('nutritionLogs', params.id);
    if (!deleted) return error('Failed to delete nutrition log', 500);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Failed to delete nutrition log:', err);
    return error('Failed to delete nutrition log', 500);
  }
}