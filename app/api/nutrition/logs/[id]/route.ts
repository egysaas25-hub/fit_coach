import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/nutrition/logs/:id
 * Get a specific nutrition log
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession(req);
    const { user } = session;

    const logId = BigInt(params.id);

    // Get nutrition plan (serving as nutrition log)
    const log = await prisma.nutrition_plans.findUnique({
      where: { id: logId },
      include: {
        nutrition_plan_macros: true,
        nutrition_meals: {
          include: {
            nutrition_meal_items: true,
          },
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

    if (!log) return notFound('Nutrition log');

    // Permission check - clients can only see their own logs
    if (user.role === 'client' && log.customer_id.toString() !== user.id.toString()) {
      return forbidden("You don't have permission to view this nutrition log.");
    }

    // Transform to expected format
    const transformedLog = {
      id: log.id.toString(),
      planId: log.id.toString(),
      clientId: log.customer_id.toString(),
      dateLogged: log.created_at,
      adherence: 'medium', // Default adherence level
      notes: log.notes,
      macros: log.nutrition_plan_macros[0] ? {
        calories: Number(log.nutrition_plan_macros[0].calories || 0),
        protein: Number(log.nutrition_plan_macros[0].protein_g || 0),
        carbs: Number(log.nutrition_plan_macros[0].carbs_g || 0),
        fat: Number(log.nutrition_plan_macros[0].fat_g || 0),
      } : null,
      meals: log.nutrition_meals.map(meal => ({
        id: meal.id.toString(),
        name: meal.meal_name,
        order: meal.order_index,
        items: meal.nutrition_meal_items.length,
      })),
    };

    return success(transformedLog);
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
  try {
    const session = await getSession(req);
    const { user } = session;

    const logId = BigInt(params.id);

    // Check if log exists
    const existingLog = await prisma.nutrition_plans.findUnique({
      where: { id: logId },
    });

    if (!existingLog) return notFound('Nutrition log');

    // Permission check - clients can only update their own logs
    if (user.role === 'client' && existingLog.customer_id.toString() !== user.id.toString()) {
      return forbidden("You don't have permission to update this nutrition log.");
    }

    const body = await req.json();

    // Don't allow changing planId or clientId
    delete body.planId;
    delete body.clientId;

    // Update the nutrition plan (serving as log)
    const updatedLog = await prisma.nutrition_plans.update({
      where: { id: logId },
      data: {
        notes: body.notes || existingLog.notes,
        calories_target: body.calories || existingLog.calories_target,
      },
      include: {
        nutrition_plan_macros: true,
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    // Transform to expected format
    const transformedLog = {
      id: updatedLog.id.toString(),
      planId: updatedLog.id.toString(),
      clientId: updatedLog.customer_id.toString(),
      dateLogged: updatedLog.created_at,
      adherence: body.adherence || 'medium',
      notes: updatedLog.notes,
      macros: updatedLog.nutrition_plan_macros[0] ? {
        calories: Number(updatedLog.nutrition_plan_macros[0].calories || 0),
        protein: Number(updatedLog.nutrition_plan_macros[0].protein_g || 0),
        carbs: Number(updatedLog.nutrition_plan_macros[0].carbs_g || 0),
        fat: Number(updatedLog.nutrition_plan_macros[0].fat_g || 0),
      } : null,
    };

    return success(transformedLog);
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
  try {
    const session = await getSession(req);
    const { user } = session;

    const logId = BigInt(params.id);

    // Check if log exists
    const existingLog = await prisma.nutrition_plans.findUnique({
      where: { id: logId },
    });

    if (!existingLog) return notFound('Nutrition log');

    // Permission check - clients can only delete their own logs
    if (user.role === 'client' && existingLog.customer_id.toString() !== user.id.toString()) {
      return forbidden("You don't have permission to delete this nutrition log.");
    }

    // Delete the nutrition plan (serving as log)
    await prisma.nutrition_plans.delete({
      where: { id: logId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Failed to delete nutrition log:', err);
    return error('Failed to delete nutrition log', 500);
  }
}