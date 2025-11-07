import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, NutritionPlan } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';

/**
 * GET /api/nutrition
 * Retrieves a list of nutrition plans.
 */
export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const nutritionPlans = database.getAll<NutritionPlan>('nutritionPlans');
    return success(nutritionPlans);
  } catch (err) {
    console.error('Failed to fetch nutrition plans:', err);
    return error('An unexpected error occurred while fetching nutrition plans.', 500);
  }
}

/**
 * POST /api/nutrition
 * Creates a new nutrition plan.
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

    if (!body.name) {
      return error('Nutrition plan name is required.', 400);
    }

    const newPlanData: Omit<NutritionPlan, 'id' | 'createdAt' | 'updatedAt'> = {
        name: body.name,
        ...body,
        creatorId: user.id,
    };

    const newPlan = database.create('nutritionPlans', newPlanData);

    return success(newPlan, 201);
  } catch (err) {
    console.error('Failed to create nutrition plan:', err);
    return error('An unexpected error occurred while creating the nutrition plan.', 500);
  }
}
