import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { database, ProgressEntry, ProgressMetric } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { z } from 'zod';

const createMeasurementSchema = z.object({
  clientId: z.string().min(1).optional(),
  measurements: z.object({
    waist: z.number().min(0).optional(),
    hips: z.number().min(0).optional(),
    chest: z.number().min(0).optional(),
    arms: z.number().min(0).optional(),
    thighs: z.number().min(0).optional(),
    shoulders: z.number().min(0).optional(),
  }),
  date: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
});

/**
 * GET /api/progress/measurements
 * Get body measurements
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let entries = database.query<ProgressEntry>(
      'progressEntries',
      (e) => e.metric === 'measurements'
    );

    // Filter by client
    if (user.role === 'client') {
      entries = entries.filter((e) => e.clientId === user.id);
    } else if (clientId) {
      entries = entries.filter((e) => e.clientId === clientId);
    } else {
      return error('clientId parameter is required', 400);
    }

    // Sort by date (newest first)
    entries = database.sort(entries, 'date', 'desc');
    entries = entries.slice(0, limit);

    return success(entries);
  } catch (err) {
    console.error('Failed to fetch measurements:', err);
    return error('Failed to fetch measurements', 500);
  }
}

/**
 * POST /api/progress/measurements
 * Log body measurements
 */
const postHandler = async (req: NextRequest, validatedBody: any) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { clientId, measurements, date, notes } = validatedBody;

    let finalClientId = clientId;
    if (user.role === 'client') {
      finalClientId = user.id;
    } else if (!clientId) {
      return error('clientId is required', 400);
    }

    const newEntry = database.create<ProgressEntry>('progressEntries', {
      clientId: finalClientId,
      metric: 'measurements',
      value: measurements, // Store as object
      date: date ? new Date(date) : new Date(),
      notes,
    });

    return success(newEntry, 201);
  } catch (err) {
    console.error('Failed to log measurements:', err);
    return error('Failed to log measurements', 500);
  }
};

export const POST = withValidation(createMeasurementSchema, postHandler);