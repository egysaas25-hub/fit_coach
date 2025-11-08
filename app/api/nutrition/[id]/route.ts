import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, NutritionPlan } from '@/lib/mock-db/database';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/nutrition/:id
 * Get a specific nutrition plan
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const plan = database.get<NutritionPlan>('nutritionPlans', params.id);
    if (!plan) return notFound('Nutrition plan');

    // Permission check - clients can only see their own plans
    if (user.role === 'client') {
      const clientPlans = database.query(
        'nutritionPlans',
        (p: any) => p.creatorId === user.id
      );
      if (!clientPlans.find((p) => p.id === params.id)) {
        return forbidden("You don't have permission to view this nutrition plan.");
      }
    }

    return success(plan);
  } catch (err) {
    console.error('Failed to fetch nutrition plan:', err);
    return error('Failed to fetch nutrition plan', 500);
  }
}

/**
 * PATCH /api/nutrition/:id
 * Update a nutrition plan
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['trainer', 'admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const plan = database.get<NutritionPlan>('nutritionPlans', params.id);
    if (!plan) return notFound('Nutrition plan');

    const body = await req.json();

    // Don't allow changing creator
    if (body.creatorId) {
      delete body.creatorId;
    }

    const updated = database.update('nutritionPlans', params.id, body);
    if (!updated) return error('Failed to update nutrition plan', 500);

    return success(updated);
  } catch (err) {
    console.error('Failed to update nutrition plan:', err);
    return error('Failed to update nutrition plan', 500);
  }
}

/**
 * DELETE /api/nutrition/:id
 * Delete a nutrition plan
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['trainer', 'admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const plan = database.get<NutritionPlan>('nutritionPlans', params.id);
    if (!plan) return notFound('Nutrition plan');

    const deleted = database.delete('nutritionPlans', params.id);
    if (!deleted) return error('Failed to delete nutrition plan', 500);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Failed to delete nutrition plan:', err);
    return error('Failed to delete nutrition plan', 500);
  }
}