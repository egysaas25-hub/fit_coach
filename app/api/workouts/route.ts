import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { success, error } from '@/lib/utils/response';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { z } from 'zod';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { prisma } from '@/lib/prisma';

const createWorkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  exercises: z.array(z.any()),
});

/**
 * GET /api/workouts
 * Retrieves a list of workout programs.
 * - All authenticated users can view workouts.
 * - Filters can be applied.
 */
const getHandler = async (req: NextRequest) => {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');

    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    // Get training plans (workouts in the database)
    let query: any = {
      where: {
        tenant_id: tenantId
      }
    };

    // In a real app, logic would differ based on role.
    // A client might see only their assigned programs.
    // A trainer might see programs they've created.
    let trainingPlans = await prisma.training_plans.findMany(query);

    // Format response to match expected structure
    const formattedWorkouts = trainingPlans.map(plan => ({
      id: plan.id.toString(),
      name: `Training Plan for Client ${plan.customer_id}`, // Placeholder name
      creatorId: plan.created_by.toString(),
      exercises: [],
      createdAt: plan.created_at,
      updatedAt: plan.created_at // Training plans don't have updated_at in schema
    }));

    return success(formattedWorkouts);
  } catch (err) {
    console.error('Failed to fetch workouts:', err);
    return error('An unexpected error occurred while fetching workouts.', 500);
  }
};

export const GET = withLogging(getHandler);

/**
 * POST /api/workouts
 * Creates a new workout program.
 * - Accessible by Trainers and Admins.
 */
const postHandler = async (req: NextRequest, validatedBody: any) => {
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
    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    // Create a training plan
    // Note: In the current schema, training plans are associated with customers
    // For this implementation, we'll create a placeholder plan
    const newTrainingPlan = await prisma.training_plans.create({
      data: {
        tenant_id: tenantId,
        customer_id: BigInt(1), // Placeholder customer ID
        version: 1,
        is_active: true,
        created_by: BigInt(user.id), // Assuming user.id is a string that can be converted to BigInt
      }
    });

    // Format response
    const newWorkout = {
      id: newTrainingPlan.id.toString(),
      name: `Training Plan ${newTrainingPlan.id}`,
      creatorId: newTrainingPlan.created_by.toString(),
      exercises: [],
      createdAt: newTrainingPlan.created_at,
      updatedAt: newTrainingPlan.created_at
    };

    return success(newWorkout, 201);
  } catch (err) {
    console.error('Failed to create workout:', err);
    return error('An unexpected error occurred while creating the workout.', 500);
  }
};

export const POST = withValidation(createWorkoutSchema, postHandler);