import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error, notFound } from '@/lib/utils/response';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/**
 * POST /api/nutrition/:id/duplicate
 * Duplicate a nutrition plan with all its meals and macros
 */
const postHandler = async (req: NextRequest, { params }: RouteParams) => {
  try {
    const session = await getSession(req);
    const { user } = session;

    // Check if user has permission to create nutrition plans
    if (!['trainer', 'admin', 'coach'].includes(user.role)) {
      return error('Insufficient permissions', 403);
    }

    const planId = BigInt(params.id);

    // Get the original nutrition plan with all related data
    const originalPlan = await prisma.nutrition_plans.findUnique({
      where: { id: planId },
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

    if (!originalPlan) {
      return notFound('Nutrition plan');
    }

    // Get the tenant_id from the original plan
    const tenantId = originalPlan.tenant_id;

    // Get the next version number for this customer
    const latestPlan = await prisma.nutrition_plans.findFirst({
      where: {
        customer_id: originalPlan.customer_id,
      },
      orderBy: {
        version: 'desc',
      },
    });

    const nextVersion = (latestPlan?.version || 0) + 1;

    // Create the duplicate nutrition plan with a transaction
    const duplicatedPlan = await prisma.$transaction(async (tx) => {
      // Create the nutrition plan
      const newPlan = await tx.nutrition_plans.create({
        data: {
          tenant_id: tenantId,
          customer_id: originalPlan.customer_id,
          version: nextVersion,
          is_active: false, // Set to inactive by default
          calories_target: originalPlan.calories_target,
          notes: originalPlan.notes ? `${originalPlan.notes} (Copy)` : '(Copy)',
          created_by: BigInt(user.id),
        },
      });

      // Create macros if they exist
      if (originalPlan.nutrition_plan_macros.length > 0) {
        await tx.nutrition_plan_macros.createMany({
          data: originalPlan.nutrition_plan_macros.map((macro) => ({
            plan_id: newPlan.id,
            calories: macro.calories,
            protein_g: macro.protein_g,
            carbs_g: macro.carbs_g,
            fat_g: macro.fat_g,
          })),
        });
      }

      // Create meals
      for (const meal of originalPlan.nutrition_meals) {
        const newMeal = await tx.nutrition_meals.create({
          data: {
            tenant_id: tenantId,
            plan_id: newPlan.id,
            meal_name: meal.meal_name,
            order_index: meal.order_index,
            notes: meal.notes,
          },
        });

        // Create meal items
        if (meal.nutrition_meal_items.length > 0) {
          await tx.nutrition_meal_items.createMany({
            data: meal.nutrition_meal_items.map((item) => ({
              tenant_id: tenantId,
              meal_id: newMeal.id,
              food_name: item.food_name,
              food_id: item.food_id,
              portion_size: item.portion_size,
              calories: item.calories,
              protein_g: item.protein_g,
              carbs_g: item.carbs_g,
              fat_g: item.fat_g,
              fiber_g: item.fiber_g,
              alternatives: item.alternatives as any, // Type assertion for JSON field
              order_index: item.order_index,
            })),
          });
        }
      }

      // Fetch the complete plan with all relations
      return await tx.nutrition_plans.findUnique({
        where: { id: newPlan.id },
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
    });

    if (!duplicatedPlan) {
      return error('Failed to create duplicate nutrition plan', 500);
    }

    // Transform to expected format
    const transformedPlan = {
      id: duplicatedPlan.id.toString(),
      name: `Nutrition Plan for ${duplicatedPlan.customer.first_name} ${duplicatedPlan.customer.last_name} (Copy)`,
      description: duplicatedPlan.notes || 'Custom nutrition plan (Copy)',
      creatorId: duplicatedPlan.created_by.toString(),
      clientId: duplicatedPlan.customer_id.toString(),
      calories: duplicatedPlan.calories_target || 0,
      macros: duplicatedPlan.nutrition_plan_macros[0]
        ? {
            protein: Number(duplicatedPlan.nutrition_plan_macros[0].protein_g || 0),
            carbs: Number(duplicatedPlan.nutrition_plan_macros[0].carbs_g || 0),
            fats: Number(duplicatedPlan.nutrition_plan_macros[0].fat_g || 0),
          }
        : null,
      meals: duplicatedPlan.nutrition_meals.map((meal) => ({
        id: meal.id.toString(),
        name: meal.meal_name,
        order: meal.order_index,
        notes: meal.notes,
        items: meal.nutrition_meal_items.map((item) => ({
          id: item.id.toString(),
          foodName: item.food_name,
          portionSize: item.portion_size,
          calories: Number(item.calories || 0),
          protein: Number(item.protein_g || 0),
          carbs: Number(item.carbs_g || 0),
          fat: Number(item.fat_g || 0),
        })),
      })),
      version: duplicatedPlan.version,
      isActive: duplicatedPlan.is_active,
      createdAt: duplicatedPlan.created_at,
      updatedAt: duplicatedPlan.created_at,
    };

    return success(transformedPlan);
  } catch (err) {
    console.error('Failed to duplicate nutrition plan:', err);
    return error('Failed to duplicate nutrition plan', 500);
  }
};

export const POST = withLogging(postHandler);
