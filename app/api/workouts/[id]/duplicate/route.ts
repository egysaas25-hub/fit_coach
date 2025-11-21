import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error, notFound } from '@/lib/utils/response';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/**
 * POST /api/workouts/:id/duplicate
 * Duplicate a workout (training plan) with all its exercises
 */
const postHandler = async (req: NextRequest, { params }: RouteParams) => {
  try {
    const session = await getSession(req);
    const { user } = session;

    // Check if user has permission to create workouts
    if (!['trainer', 'admin', 'coach'].includes(user.role)) {
      return error('Insufficient permissions', 403);
    }

    const workoutId = BigInt(params.id);

    // Get the original training plan with all exercises
    const originalPlan = await prisma.training_plans.findUnique({
      where: { id: workoutId },
      include: {
        training_plan_exercises: {
          include: {
            exercise: true,
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
      return notFound('Workout');
    }

    // Get the tenant_id from the original plan
    const tenantId = originalPlan.tenant_id;

    // Get the next version number for this customer
    const latestPlan = await prisma.training_plans.findFirst({
      where: {
        customer_id: originalPlan.customer_id,
      },
      orderBy: {
        version: 'desc',
      },
    });

    const nextVersion = (latestPlan?.version || 0) + 1;

    // Create the duplicate training plan
    const duplicatedPlan = await prisma.training_plans.create({
      data: {
        tenant_id: tenantId,
        customer_id: originalPlan.customer_id,
        version: nextVersion,
        is_active: false, // Set to inactive by default
        split: originalPlan.split,
        notes: originalPlan.notes ? `${originalPlan.notes} (Copy)` : '(Copy)',
        created_by: BigInt(user.id),
        training_plan_exercises: {
          create: originalPlan.training_plan_exercises.map((tpe) => ({
            exercise_id: tpe.exercise_id,
            sets: tpe.sets,
            reps: tpe.reps,
            order_index: tpe.order_index,
          })),
        },
      },
      include: {
        training_plan_exercises: {
          include: {
            exercise: true,
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

    // Transform to expected workout format
    const workout = {
      id: duplicatedPlan.id.toString(),
      name: `Training Plan for ${duplicatedPlan.customer.first_name} ${duplicatedPlan.customer.last_name} (Copy)`,
      creatorId: duplicatedPlan.created_by.toString(),
      clientId: duplicatedPlan.customer_id.toString(),
      exercises: duplicatedPlan.training_plan_exercises.map((tpe) => ({
        id: tpe.exercise.id.toString(),
        name: tpe.exercise.name,
        sets: tpe.sets,
        reps: tpe.reps,
        order: tpe.order_index,
      })),
      type: 'strength',
      difficulty: 'intermediate',
      version: duplicatedPlan.version,
      isActive: duplicatedPlan.is_active,
      createdAt: duplicatedPlan.created_at,
      updatedAt: duplicatedPlan.created_at,
    };

    return success(workout);
  } catch (err) {
    console.error('Failed to duplicate workout:', err);
    return error('Failed to duplicate workout', 500);
  }
};

export const POST = withLogging(postHandler);
