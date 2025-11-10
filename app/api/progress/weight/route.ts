import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { database, ProgressEntry, ProgressMetric } from '@/lib/mock-db/database';
import { success, error, forbidden } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withLogging } from '@/lib/middleware/logging.middleware';
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
const getHandler = async (req: NextRequest) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let entries = database.query<ProgressEntry>(
      'progressEntries',
      (e) => e.metric === 'weight'
    );

    // Filter by client
    if (user.role === 'client') {
      entries = entries.filter((e) => e.clientId === user.id);
    } else if (clientId) {
      entries = entries.filter((e) => e.clientId === clientId);
    } else {
      return error('clientId parameter is required for trainers/admins', 400);
    }

    // Filter by date range
    if (fromDate) {
      const from = new Date(fromDate);
      entries = entries.filter((e) => new Date(e.date) >= from);
    }
    if (toDate) {
      const to = new Date(toDate);
      entries = entries.filter((e) => new Date(e.date) <= to);
    }

    // Sort by date (oldest first for progress charts)
    entries = database.sort(entries, 'date', 'asc');

    // Limit results
    entries = entries.slice(0, limit);

    return success(entries);
  } catch (err) {
    console.error('Failed to fetch weight progress:', err);
    return error('Failed to fetch weight progress', 500);
  }
};

export const GET = withLogging(getHandler);

/**
 * POST /api/progress/weight
 * Log weight progress
 */
const postHandler = async (req: NextRequest, validatedBody: any) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { clientId, value, date, notes } = validatedBody;

    // Determine client ID
    let finalClientId = clientId;
    if (user.role === 'client') {
      finalClientId = user.id;
    } else if (!clientId) {
      return error('clientId is required for trainers/admins', 400);
    }

    const newEntry = database.create<ProgressEntry>('progressEntries', {
      clientId: finalClientId,
      metric: ProgressMetric.Weight,
      value,
      date: date ? new Date(date) : new Date(),
    });

    return success(newEntry, 201);
  } catch (err) {
    console.error('Failed to log weight:', err);
    return error('Failed to log weight', 500);
  }
};

export const POST = withValidation(createWeightLogSchema, postHandler);