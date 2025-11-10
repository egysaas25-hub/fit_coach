import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, NutritionPlan } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { ensureDbInitialized } from '@/lib/db/init';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { z } from 'zod';

const createNutritionPlanSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(1000).optional(),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fats: z.number().min(0).optional(),
  meals: z.array(z.any()).optional(),
});

/**
 * GET /api/nutrition
 * Retrieves a list of nutrition plans.
 */
const getHandler = async (req: NextRequest) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    let nutritionPlans = database.getAll<NutritionPlan>('nutritionPlans');

    // Filter based on role
    if (user.role === 'client') {
      // Clients see plans created by their trainer or for them
      nutritionPlans = nutritionPlans.filter(
        (plan) => plan.creatorId === user.id || plan.name.includes('Public')
      );
    } else if (user.role === 'trainer') {
      // Trainers see their own plans
      nutritionPlans = nutritionPlans.filter((plan) => plan.creatorId === user.id);
    }

    // Search
    if (search) {
      nutritionPlans = database.search('nutritionPlans', search, ['name']);
    }

    // Sort by creation date (newest first)
    nutritionPlans = database.sort(nutritionPlans, 'createdAt', 'desc');

    // Paginate
    const result = database.paginate(nutritionPlans, page, limit);

    return success({ data: result.data, pagination: result.pagination });
  } catch (err) {
    console.error('Failed to fetch nutrition plans:', err);
    return error('Failed to fetch nutrition plans', 500);
  }
};

export const GET = withLogging(getHandler);

/**
 * POST /api/nutrition
 * Creates a new nutrition plan.
 * - Accessible by Trainers and Admins.
 */
const postHandler = async (req: NextRequest, validatedBody: any) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  const roleCheck = requireRole(user, ['trainer', 'admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const newPlanData: Omit<NutritionPlan, 'id' | 'createdAt' | 'updatedAt'> = {
      ...validatedBody,
      creatorId: user.id,
    };

    const newPlan = database.create('nutritionPlans', newPlanData);

    return success(newPlan, 201);
  } catch (err) {
    console.error('Failed to create nutrition plan:', err);
    return error('Failed to create nutrition plan', 500);
  }
};

export const POST = withValidation(createNutritionPlanSchema, postHandler);