import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/clients/:id/programs
 * Get all programs (workouts + nutrition) assigned to client
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession(req);
    const { user } = session;
    const clientId = BigInt(params.id);

    // Check if client exists
    const client = await prisma.customers.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        tenant_id: true,
      },
    });

    if (!client) return notFound('Client');

    // Permission check - ensure user belongs to same tenant
    if (user.tenant_id !== Number(client.tenant_id)) {
      return forbidden("You don't have permission to view this client's programs.");
    }

    // Get training plans for this client
    const trainingPlans = await prisma.training_plans.findMany({
      where: {
        customer_id: clientId,
        tenant_id: BigInt(user.tenant_id),
      },
      include: {
        created_by_team_member: {
          select: {
            id: true,
            full_name: true,
          },
        },
        training_plan_exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                description: true,
                equipment_needed: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    // Get nutrition plans for this client
    const nutritionPlans = await prisma.nutrition_plans.findMany({
      where: {
        customer_id: clientId,
        tenant_id: BigInt(user.tenant_id),
      },
      include: {
        created_by_team_member: {
          select: {
            id: true,
            full_name: true,
          },
        },
        nutrition_plan_macros: true,
        nutrition_meals: {
          include: {
            nutrition_meal_items: {
              include: {
                food: {
                  select: {
                    id: true,
                    food_name: true,
                    calories: true,
                    protein_g: true,
                    carbs_g: true,
                    fat_g: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 5,
    });

    // Transform training plans to expected format
    const workouts = trainingPlans.map((plan) => ({
      id: plan.id.toString(),
      clientId: plan.customer_id.toString(),
      creatorId: plan.created_by.toString(),
      creatorName: plan.created_by_team_member.full_name,
      version: plan.version,
      isActive: plan.is_active,
      split: plan.split,
      notes: plan.notes,
      exercises: plan.training_plan_exercises.map((tpe) => ({
        id: tpe.exercise.id.toString(),
        name: tpe.exercise.name,
        description: tpe.exercise.description,
        equipment: tpe.exercise.equipment_needed,
        sets: tpe.sets,
        reps: tpe.reps,
        order: tpe.order_index,
      })),
      createdAt: plan.created_at,
    }));

    // Transform nutrition plans to expected format
    const nutritionPrograms = nutritionPlans.map((plan) => ({
      id: plan.id.toString(),
      clientId: plan.customer_id.toString(),
      creatorId: plan.created_by.toString(),
      creatorName: plan.created_by_team_member.full_name,
      version: plan.version,
      isActive: plan.is_active,
      caloriesTarget: plan.calories_target,
      notes: plan.notes,
      macros: plan.nutrition_plan_macros[0] ? {
        calories: Number(plan.nutrition_plan_macros[0].calories),
        protein: Number(plan.nutrition_plan_macros[0].protein_g),
        carbs: Number(plan.nutrition_plan_macros[0].carbs_g),
        fat: Number(plan.nutrition_plan_macros[0].fat_g),
      } : null,
      meals: plan.nutrition_meals.map((meal) => ({
        id: meal.id.toString(),
        name: meal.meal_name,
        order: meal.order_index,
        items: meal.nutrition_meal_items.map((item) => ({
          id: item.id.toString(),
          foodName: item.food_name,
          portionSize: item.portion_size,
          calories: Number(item.calories),
          protein: Number(item.protein_g),
          carbs: Number(item.carbs_g),
          fat: Number(item.fat_g),
        })),
      })),
      createdAt: plan.created_at,
    }));

    const programs = {
      clientId: params.id,
      workouts: workouts,
      nutritionPlans: nutritionPrograms,
      totalWorkouts: workouts.length,
      totalNutritionPlans: nutritionPrograms.length,
    };

    return success(programs);
  } catch (err) {
    console.error('Failed to fetch client programs:', err);
    return error('Failed to fetch client programs', 500);
  }
}