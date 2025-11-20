import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error, forbidden } from '@/lib/utils/response';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const createNutritionLogSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  clientId: z.string().min(1, 'Client ID is required').optional(),
  dateLogged: z.string().datetime().optional(),
  adherence: z.enum(['high', 'medium', 'low']).optional(),
  notes: z.string().max(1000).optional(),
});

/**
 * GET /api/nutrition/logs
 * Get nutrition logs
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const { user } = session;

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const planId = searchParams.get('planId');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Determine which customer to query
    let finalClientId: string;
    if (user.role === 'client') {
      finalClientId = user.id.toString();
    } else if (clientId) {
      finalClientId = clientId;
    } else {
      return error('Client ID is required for trainers and admins', 400);
    }

    // Build where clause
    const whereClause: any = {
      tenant_id: BigInt(user.tenant_id),
      customer_id: BigInt(finalClientId),
    };

    // Filter by plan if specified
    if (planId) {
      whereClause.id = BigInt(planId); // Assuming planId refers to nutrition plan ID
    }

    // Filter by date range
    if (fromDate) {
      whereClause.created_at = { ...whereClause.created_at, gte: new Date(fromDate) };
    }
    if (toDate) {
      whereClause.created_at = { ...whereClause.created_at, lte: new Date(toDate) };
    }

    // Get nutrition plans (which serve as nutrition logs in our schema)
    const logs = await prisma.nutrition_plans.findMany({
      where: whereClause,
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
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.nutrition_plans.count({ where: whereClause });

    // Transform to expected nutrition log format
    const transformedLogs = logs.map(plan => ({
      id: plan.id.toString(),
      planId: plan.id.toString(),
      clientId: plan.customer_id.toString(),
      dateLogged: plan.created_at,
      adherence: 'medium', // Default adherence level
      notes: plan.notes,
      macros: plan.nutrition_plan_macros[0] ? {
        calories: Number(plan.nutrition_plan_macros[0].calories || 0),
        protein: Number(plan.nutrition_plan_macros[0].protein_g || 0),
        carbs: Number(plan.nutrition_plan_macros[0].carbs_g || 0),
        fat: Number(plan.nutrition_plan_macros[0].fat_g || 0),
      } : null,
      meals: plan.nutrition_meals.length,
    }));

    const pagination = {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
    };

    return success({ data: transformedLogs, pagination });
  } catch (err) {
    console.error('Failed to fetch nutrition logs:', err);
    return error('Failed to fetch nutrition logs', 500);
  }
}

/**
 * POST /api/nutrition/logs
 * Create a new nutrition log
 */
const postHandler = async (req: NextRequest, validatedBody: any) => {
  try {
    const session = await getSession(req);
    const { user } = session;

    const { planId, clientId, dateLogged, adherence, notes } = validatedBody;

    // Determine the client ID
    let finalClientId = clientId;
    if (user.role === 'client') {
      finalClientId = user.id.toString();
    } else if (!clientId) {
      return error('Client ID is required for trainers and admins', 400);
    }

    // Verify the plan exists
    const existingPlan = await prisma.nutrition_plans.findUnique({
      where: { id: BigInt(planId) },
    });

    if (!existingPlan) {
      return error('Nutrition plan not found', 404);
    }

    // Create a new nutrition plan entry as a log (since we don't have a separate logs table)
    // This represents a nutrition log entry based on an existing plan
    const newLog = await prisma.nutrition_plans.create({
      data: {
        tenant_id: BigInt(user.tenant_id),
        customer_id: BigInt(finalClientId),
        version: 1,
        is_active: false, // Mark as log entry, not active plan
        calories_target: existingPlan.calories_target,
        notes: notes || `Nutrition log based on plan ${planId}`,
        created_by: BigInt(user.id),
      },
      include: {
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
      id: newLog.id.toString(),
      planId: planId,
      clientId: newLog.customer_id.toString(),
      dateLogged: dateLogged ? new Date(dateLogged) : newLog.created_at,
      adherence: adherence || 'medium',
      notes: newLog.notes,
    };

    return success(transformedLog, 201);
  } catch (err) {
    console.error('Failed to create nutrition log:', err);
    return error('Failed to create nutrition log', 500);
  }
};

export const POST = withValidation(createNutritionLogSchema, postHandler);