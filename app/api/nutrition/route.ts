import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { success, error } from '@/lib/utils/response';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

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
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    // Get nutrition plans
    let query: any = {
      where: {
        tenant_id: tenantId
      }
    };

    // Filter based on role
    if (user.role === 'client') {
      // Clients see plans created by their trainer or for them
      // For now, we'll just get all plans since we don't have client-trainer relationships set up
      // In a real implementation, you would filter by the client's trainer
    } else if (user.role === 'trainer') {
      // Trainers see their own plans
      query.where.created_by = BigInt(user.id);
    }

    // Search
    if (search) {
      query.where.notes = { contains: search, mode: 'insensitive' };
    }

    let nutritionPlans = await prisma.nutrition_plans.findMany(query);

    // Sort by creation date (newest first)
    nutritionPlans.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    // Paginate manually
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNutritionPlans = nutritionPlans.slice(startIndex, endIndex);

    const pagination = {
      page,
      limit,
      total: nutritionPlans.length,
      pages: Math.ceil(nutritionPlans.length / limit)
    };

    // Format response
    const formattedNutritionPlans = paginatedNutritionPlans.map(plan => ({
      id: plan.id.toString(),
      name: `Nutrition Plan ${plan.id}`, // Nutrition plans don't have a name field
      description: plan.notes || '',
      calories: plan.calories_target || 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      meals: [],
      creatorId: plan.created_by.toString(),
      createdAt: plan.created_at,
      updatedAt: plan.created_at // Nutrition plans don't have updated_at in schema
    }));

    return success({ data: formattedNutritionPlans, pagination });
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
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  const roleCheck = requireRole(user, ['trainer', 'admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    // Create a nutrition plan
    const newNutritionPlan = await prisma.nutrition_plans.create({
      data: {
        tenant_id: tenantId,
        customer_id: BigInt(1), // Placeholder customer ID
        version: 1,
        is_active: true,
        calories_target: validatedBody.calories || 0,
        notes: validatedBody.description || '',
        created_by: BigInt(user.id),
      }
    });

    // Format response
    const newPlan = {
      id: newNutritionPlan.id.toString(),
      name: validatedBody.name || `Nutrition Plan ${newNutritionPlan.id}`,
      description: validatedBody.description || '',
      calories: validatedBody.calories || 0,
      protein: validatedBody.protein || 0,
      carbs: validatedBody.carbs || 0,
      fats: validatedBody.fats || 0,
      meals: validatedBody.meals || [],
      creatorId: newNutritionPlan.created_by.toString(),
      createdAt: newNutritionPlan.created_at,
      updatedAt: newNutritionPlan.created_at
    };

    return success(newPlan, 201);
  } catch (err) {
    console.error('Failed to create nutrition plan:', err);
    return error('Failed to create nutrition plan', 500);
  }
};

export const POST = withValidation(createNutritionPlanSchema, postHandler);