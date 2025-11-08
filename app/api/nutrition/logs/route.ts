import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, NutritionLog } from '@/lib/mock-db/database';
import { success, error, forbidden } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { z } from 'zod';

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
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const planId = searchParams.get('planId');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    let logs = database.getAll<NutritionLog>('nutritionLogs');

    // Filter by client
    if (user.role === 'client') {
      // Clients can only see their own logs
      logs = logs.filter((log) => log.clientId === user.id);
    } else if (clientId) {
      // Trainers/admins can filter by client
      logs = logs.filter((log) => log.clientId === clientId);
    }

    // Filter by plan
    if (planId) {
      logs = logs.filter((log) => log.planId === planId);
    }

    // Filter by date range
    if (fromDate) {
      const from = new Date(fromDate);
      logs = logs.filter((log) => new Date(log.dateLogged) >= from);
    }
    if (toDate) {
      const to = new Date(toDate);
      logs = logs.filter((log) => new Date(log.dateLogged) <= to);
    }

    // Sort by date (most recent first)
    logs = database.sort(logs, 'dateLogged', 'desc');

    // Paginate
    const result = database.paginate(logs, page, limit);

    return success({ data: result.data, pagination: result.pagination });
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
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { planId, clientId, dateLogged, adherence, notes } = validatedBody;

    // Determine the client ID
    let finalClientId = clientId;
    if (user.role === 'client') {
      // Clients can only log for themselves
      finalClientId = user.id;
    } else if (!clientId) {
      return error('Client ID is required for trainers and admins', 400);
    }

    // Verify the plan exists
    const plan = database.get<any>('nutritionPlans', planId);
    if (!plan) {
      return error('Nutrition plan not found', 404);
    }

    // Create the log
    const newLog = database.create<NutritionLog>('nutritionLogs', {
      planId,
      clientId: finalClientId,
      dateLogged: dateLogged ? new Date(dateLogged) : new Date(),
      adherence: adherence || 'medium',
      notes,
    });

    return success(newLog, 201);
  } catch (err) {
    console.error('Failed to create nutrition log:', err);
    return error('Failed to create nutrition log', 500);
  }
};

export const POST = withValidation(createNutritionLogSchema, postHandler);