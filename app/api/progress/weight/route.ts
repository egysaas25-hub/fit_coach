import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error, forbidden } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { z } from 'zod';

const createWeightLogSchema = z.object({
  clientId: z.string().min(1).optional(),
  value: z.number().min(0, 'Weight must be positive'),
  date: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
});

/**
 * GET /api/progress/weight
 * Get weight progress entries
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const { user } = session;

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let finalClientId: bigint;
    if (user.role === 'client') {
      finalClientId = BigInt(user.id);
    } else if (clientId) {
      finalClientId = BigInt(clientId);
    } else {
      return error('clientId parameter is required for trainers/admins', 400);
    }

    // Build date filter
    const dateFilter: any = {};
    if (fromDate) {
      dateFilter.gte = new Date(fromDate);
    }
    if (toDate) {
      dateFilter.lte = new Date(toDate);
    }

    // Get weight entries from progress_tracking table
    const weightEntries = await prisma.progress_tracking.findMany({
      where: {
        customer_id: finalClientId,
        tenant_id: BigInt(user.tenant_id),
        weight_kg: { not: null },
        recorded_at: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      orderBy: { recorded_at: 'asc' },
      take: limit,
    });

    // Transform to expected format
    const entries = weightEntries.map(entry => ({
      id: entry.id.toString(),
      clientId: entry.customer_id.toString(),
      metric: 'weight',
      value: Number(entry.weight_kg),
      date: entry.recorded_at,
      notes: entry.notes,
    }));

    return success(entries);
  } catch (err) {
    console.error('Failed to fetch weight progress:', err);
    return error('Failed to fetch weight progress', 500);
  }
}

/**
 * POST /api/progress/weight
 * Log weight progress
 */
const postHandler = async (req: NextRequest, validatedBody: any) => {
  try {
    const session = await getSession(req);
    const { user } = session;

    const { clientId, value, date, notes } = validatedBody;

    // Determine client ID
    let finalClientId: bigint;
    if (user.role === 'client') {
      finalClientId = BigInt(user.id);
    } else if (!clientId) {
      return error('clientId is required for trainers/admins', 400);
    } else {
      finalClientId = BigInt(clientId);
    }

    // Create progress tracking entry
    const newEntry = await prisma.progress_tracking.create({
      data: {
        tenant_id: BigInt(user.tenant_id),
        customer_id: finalClientId,
        recorded_at: date ? new Date(date) : new Date(),
        weight_kg: value,
        notes: notes,
      },
    });

    // Transform to expected format
    const response = {
      id: newEntry.id.toString(),
      clientId: newEntry.customer_id.toString(),
      metric: 'weight',
      value: Number(newEntry.weight_kg),
      date: newEntry.recorded_at,
      notes: newEntry.notes,
    };

    return success(response, 201);
  } catch (err) {
    console.error('Failed to log weight:', err);
    return error('Failed to log weight', 500);
  }
};

export const POST = withValidation(createWeightLogSchema, postHandler);