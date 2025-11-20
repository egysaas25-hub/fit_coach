import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/nutrition/:id
 * Get a specific nutrition plan
 */
const getHandler = async (req: NextRequest, { params }: RouteParams) => {
  try {
    const session = await getSession(req);
    const { user } = session;

    const planId = BigInt(params.id);

    // Get nutrition plan with related data
    const plan = await prisma.nutrition_plans.findUnique({
      where: { id: planId },
      include: {
        nutrition_plan_macros: true,
        nutrition_meals: {
          include: {
            nutrition_meal_items: {
              include: {
                food: true,
              },
            },
          },
          orderBy: { order_index: 'asc' },
        },
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        created_by_team_member: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    if (!plan) return notFound('Nutrition plan');

    // Permission check - clients can only see their own plans
    if (user.role === 'client' && plan.customer_id.toString() !== user.id.toString()) {
      return forbidden("You don't have permission to view this nutrition plan.");
    }

    // Transform to expected format
    const transformedPlan = {
      id: plan.id.toString(),
      name: `Nutrition Plan for ${plan.customer.first_name} ${plan.customer.last_name}`,
      description: plan.notes || 'Custom nutrition plan',
      creatorId: plan.created_by.toString(),
      clientId: plan.customer_id.toString(),
      calories: plan.calories_target || 0,
      macros: plan.nutrition_plan_macros[0] ? {
        protein: Number(plan.nutrition_plan_macros[0].protein_g || 0),
        carbs: Number(plan.nutrition_plan_macros[0].carbs_g || 0),
        fats: Number(plan.nutrition_plan_macros[0].fat_g || 0),
      } : null,
      meals: plan.nutrition_meals.map(meal => ({
        id: meal.id.toString(),
        name: meal.meal_name,
        order: meal.order_index,
        notes: meal.notes,
        items: meal.nutrition_meal_items.map(item => ({
          id: item.id.toString(),
          foodName: item.food_name,
          portionSize: item.portion_size,
          calories: Number(item.calories || 0),
          protein: Number(item.protein_g || 0),
          carbs: Number(item.carbs_g || 0),
          fat: Number(item.fat_g || 0),
        })),
      })),
      isActive: plan.is_active,
      version: plan.version,
      createdAt: plan.created_at,
      updatedAt: plan.created_at,
    };

    return success(transformedPlan);
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
  try {
    const session = await getSession(req);
    const { user } = session;

    // Check if user has permission to update nutrition plans
    if (!['trainer', 'admin', 'coach'].includes(user.role)) {
      return error('Insufficient permissions', 403);
    }

    const planId = BigInt(params.id);

    // Check if plan exists
    const existingPlan = await prisma.nutrition_plans.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) return notFound('Nutrition plan');

    // Don't allow changing creator
    if (validatedBody.creatorId) {
      delete validatedBody.creatorId;
    }

    // Update nutrition plan
    const updatedPlan = await prisma.nutrition_plans.update({
      where: { id: planId },
      data: {
        notes: validatedBody.description || existingPlan.notes,
        calories_target: validatedBody.calories || existingPlan.calories_target,
      },
      include: {
        nutrition_plan_macros: true,
        nutrition_meals: {
          include: {
            nutrition_meal_items: true,
          },
          orderBy: { order_index: 'asc' },
        },
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    // Update macros if provided
    if (validatedBody.protein || validatedBody.carbs || validatedBody.fats) {
      // Check if macros exist for this plan
      const existingMacros = await prisma.nutrition_plan_macros.findFirst({
        where: { plan_id: planId },
      });

      if (existingMacros) {
        // Update existing macros
        await prisma.nutrition_plan_macros.update({
          where: { id: existingMacros.id },
          data: {
            protein_g: validatedBody.protein || existingMacros.protein_g,
            carbs_g: validatedBody.carbs || existingMacros.carbs_g,
            fat_g: validatedBody.fats || existingMacros.fat_g,
          },
        });
      } else {
        // Create new macros
        await prisma.nutrition_plan_macros.create({
          data: {
            plan_id: planId,
            protein_g: validatedBody.protein || 0,
            carbs_g: validatedBody.carbs || 0,
            fat_g: validatedBody.fats || 0,
          },
        });
      }
    }

    // Transform to expected format
    const transformedPlan = {
      id: updatedPlan.id.toString(),
      name: validatedBody.name || `Nutrition Plan for ${updatedPlan.customer.first_name} ${updatedPlan.customer.last_name}`,
      description: updatedPlan.notes,
      creatorId: updatedPlan.created_by.toString(),
      clientId: updatedPlan.customer_id.toString(),
      calories: updatedPlan.calories_target || 0,
      macros: {
        protein: validatedBody.protein || 0,
        carbs: validatedBody.carbs || 0,
        fats: validatedBody.fats || 0,
      },
      meals: updatedPlan.nutrition_meals.length,
      isActive: updatedPlan.is_active,
      createdAt: updatedPlan.created_at,
      updatedAt: updatedPlan.created_at,
    };

    return success(transformedPlan);
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
  try {
    const session = await getSession(req);
    const { user } = session;

    // Check if user has permission to delete nutrition plans
    if (!['trainer', 'admin', 'coach'].includes(user.role)) {
      return error('Insufficient permissions', 403);
    }

    const planId = BigInt(params.id);

    // Check if plan exists
    const existingPlan = await prisma.nutrition_plans.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) return notFound('Nutrition plan');

    // Delete nutrition plan (cascade will delete associated meals and macros)
    await prisma.nutrition_plans.delete({
      where: { id: planId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Failed to delete nutrition plan:', err);
    return error('Failed to delete nutrition plan', 500);
  }
};

export const DELETE = withLogging(deleteHandler);