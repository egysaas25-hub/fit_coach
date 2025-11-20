import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { success, error } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/analytics/trainers
 * Get trainer analytics (Admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(req, ['admin']);
    const { user } = session;

    // Get all trainers (team members with coach role)
    const trainers = await prisma.team_members.findMany({
      where: {
        tenant_id: BigInt(user.tenant_id),
        role: 'coach',
        active: true,
      },
      select: {
        id: true,
        full_name: true,
        max_caseload: true,
        created_at: true,
      },
    });

    // Get subscription assignments (coach ownership)
    const subscriptions = await prisma.subscriptions.findMany({
      where: {
        tenant_id: BigInt(user.tenant_id),
        coach_owner_id: { not: null },
      },
      select: {
        coach_owner_id: true,
        customer_id: true,
        status: true,
      },
    });

    // Get training plans created by trainers
    const trainingPlans = await prisma.training_plans.findMany({
      where: {
        tenant_id: BigInt(user.tenant_id),
      },
      select: {
        created_by: true,
        customer_id: true,
        is_active: true,
      },
    });

    // Get nutrition plans created by trainers
    const nutritionPlans = await prisma.nutrition_plans.findMany({
      where: {
        tenant_id: BigInt(user.tenant_id),
      },
      select: {
        created_by: true,
        customer_id: true,
        is_active: true,
      },
    });

    // Get appointments (using interactions with type='appointment')
    const appointments = await prisma.interactions.findMany({
      where: {
        tenant_id: BigInt(user.tenant_id),
        // Filter for appointment-type interactions if using metadata
      },
      select: {
        by_team_member_id: true,
        customer_id: true,
        sent_at: true,
        meta: true,
      },
    });

    // Calculate trainer performance statistics
    const trainerStats = trainers.map((trainer) => {
      const trainerId = trainer.id;
      
      // Count clients assigned to this trainer
      const trainerSubscriptions = subscriptions.filter(
        (s) => s.coach_owner_id && s.coach_owner_id.toString() === trainerId.toString()
      );
      
      // Count training plans created by this trainer
      const trainerWorkouts = trainingPlans.filter(
        (tp) => tp.created_by.toString() === trainerId.toString()
      );
      
      // Count nutrition plans created by this trainer
      const trainerNutrition = nutritionPlans.filter(
        (np) => np.created_by.toString() === trainerId.toString()
      );
      
      // Count appointments/interactions by this trainer
      const trainerAppointments = appointments.filter(
        (a) => a.by_team_member_id && a.by_team_member_id.toString() === trainerId.toString()
      );

      return {
        trainerId: trainer.id.toString(),
        name: trainer.full_name,
        clientCount: trainerSubscriptions.length,
        maxCaseload: trainer.max_caseload,
        workoutsCreated: trainerWorkouts.length,
        nutritionPlansCreated: trainerNutrition.length,
        totalAppointments: trainerAppointments.length,
        completedAppointments: trainerAppointments.length, // All recorded interactions are considered completed
        utilizationRate: trainer.max_caseload > 0 ? 
          (trainerSubscriptions.length / trainer.max_caseload) * 100 : 0,
      };
    });

    // Sort by client count
    trainerStats.sort((a, b) => b.clientCount - a.clientCount);

    const totalClients = subscriptions.length;
    const analytics = {
      totalTrainers: trainers.length,
      trainerPerformance: trainerStats,
      averageClientsPerTrainer: trainers.length > 0 ? totalClients / trainers.length : 0,
      totalWorkoutsCreated: trainingPlans.length,
      totalNutritionPlansCreated: nutritionPlans.length,
      workload: {
        mostClients: trainerStats[0] || null,
        leastClients: trainerStats[trainerStats.length - 1] || null,
        balanced: trainerStats.filter(
          (t) => t.clientCount >= 3 && t.clientCount <= 10
        ).length,
        overloaded: trainerStats.filter(
          (t) => t.utilizationRate > 90
        ).length,
        underutilized: trainerStats.filter(
          (t) => t.utilizationRate < 50
        ).length,
      },
    };

    return success(analytics);
  } catch (err) {
    console.error('Failed to fetch trainer analytics:', err);
    return error('Failed to fetch trainer analytics', 500);
  }
}