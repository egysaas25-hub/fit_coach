import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, NutritionPlan } from '@/lib/mock-db/database';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { z } from 'zod';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/nutrition/:id
 * Get a specific nutrition plan
 */
const getHandler = async (req: NextRequest, { params }: RouteParams) => {
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
};

export const GET = withLogging(getHandler);

/**
 * PATCH /api/nutrition/:id
 * Update a nutrition plan
 */
const updateNutritionPlanSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(1000).optional(),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fats: z.number().min(0).optional(),
  meals: z.array(z.any()).optional(),
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
    const plan = database.get<NutritionPlan>('nutritionPlans', params.id);
    if (!plan) return notFound('Nutrition plan');

    // Don't allow changing creator
    if (validatedBody.creatorId) {
      delete validatedBody.creatorId;
    }

    const updated = database.update('nutritionPlans', params.id, validatedBody);
    if (!updated) return error('Failed to update nutrition plan', 500);

    return success(updated);
  } catch (err) {
    console.error('Failed to update nutrition plan:', err);
    return error('Failed to update nutrition plan', 500);
  }
};

export const PATCH = withLogging(withValidation(updateNutritionPlanSchema, patchHandler));

/**
 * DELETE /api/nutrition/:id
 * Delete a nutrition plan
 */
const deleteHandler = async (req: NextRequest, { params }: RouteParams) => {
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
};

export const DELETE = withLogging(deleteHandler);