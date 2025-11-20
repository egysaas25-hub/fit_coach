import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error, notFound } from '@/lib/utils/response';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/workouts/:id
 */
const getHandler = async (req: NextRequest, { params }: RouteParams) => {
  try {
    const session = await getSession(req);
    const { user } = session;

    const workoutId = BigInt(params.id);

    // Get training plan with exercises
    const trainingPlan = await prisma.training_plans.findUnique({
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
        created_by_team_member: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    if (!trainingPlan) return notFound('Workout');

    // Transform to expected workout format
    const workout = {
      id: trainingPlan.id.toString(),
      name: `Training Plan for ${trainingPlan.customer.first_name} ${trainingPlan.customer.last_name}`,
      creatorId: trainingPlan.created_by.toString(),
      exercises: trainingPlan.training_plan_exercises.map(tpe => ({
        id: tpe.exercise.id.toString(),
        name: tpe.exercise.name,
        sets: tpe.sets,
        reps: tpe.reps,
        order: tpe.order_index,
      })),
      type: 'strength', // Default type
      difficulty: 'intermediate', // Default difficulty
      createdAt: trainingPlan.created_at,
      updatedAt: trainingPlan.created_at,
    };

    return success(workout);
  } catch (err) {
    console.error('Failed to fetch workout:', err);
    return error('Failed to fetch workout', 500);
  }
};

export const GET = withLogging(getHandler);

/**
 * PATCH /api/workouts/:id
 */
const updateWorkoutSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  exercises: z.array(z.any()).optional(),
  type: z.string().optional(),
  difficulty: z.string().optional(),
});

const patchHandler = async (
  req: NextRequest,
  validatedBody: any,
  { params }: RouteParams
) => {
  try {
    const session = await getSession(req);
    const { user } = session;

    // Check if user has permission to update workouts
    if (!['trainer', 'admin', 'coach'].includes(user.role)) {
      return error('Insufficient permissions', 403);
    }

    const workoutId = BigInt(params.id);

    // Check if training plan exists
    const existingPlan = await prisma.training_plans.findUnique({
      where: { id: workoutId },
    });

    if (!existingPlan) return notFound('Workout');

    // Update training plan notes (limited update for now)
    const updatedPlan = await prisma.training_plans.update({
      where: { id: workoutId },
      data: {
        notes: validatedBody.notes || existingPlan.notes,
        // Note: The current schema doesn't support updating name, exercises directly
        // This would require more complex logic to update training_plan_exercises
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

    // Transform to expected format
    const workout = {
      id: updatedPlan.id.toString(),
      name: `Training Plan for ${updatedPlan.customer.first_name} ${updatedPlan.customer.last_name}`,
      creatorId: updatedPlan.created_by.toString(),
      exercises: updatedPlan.training_plan_exercises.map(tpe => ({
        id: tpe.exercise.id.toString(),
        name: tpe.exercise.name,
        sets: tpe.sets,
        reps: tpe.reps,
        order: tpe.order_index,
      })),
      type: 'strength',
      difficulty: 'intermediate',
      createdAt: updatedPlan.created_at,
      updatedAt: updatedPlan.created_at,
    };

    return success(workout);
  } catch (err) {
    console.error('Failed to update workout:', err);
    return error('Failed to update workout', 500);
  }
};

export const PATCH = withLogging(withValidation(updateWorkoutSchema, patchHandler));

/**
 * DELETE /api/workouts/:id
 */
const deleteHandler = async (req: NextRequest, { params }: RouteParams) => {
  try {
    const session = await getSession(req);
    const { user } = session;

    // Check if user has permission to delete workouts
    if (!['trainer', 'admin', 'coach'].includes(user.role)) {
      return error('Insufficient permissions', 403);
    }

    const workoutId = BigInt(params.id);

    // Check if training plan exists
    const existingPlan = await prisma.training_plans.findUnique({
      where: { id: workoutId },
    });

    if (!existingPlan) return notFound('Workout');

    // Delete training plan (cascade will delete associated exercises)
    await prisma.training_plans.delete({
      where: { id: workoutId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Failed to delete workout:', err);
    return error('Failed to delete workout', 500);
  }
};

export const DELETE = withLogging(deleteHandler);