import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';
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
  try {
    const session = await getSession(req);
    const { user } = session;

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let finalClientId: bigint;
    if (user.role === 'client') {
      finalClientId = BigInt(user.id);
    } else if (clientId) {
      finalClientId = BigInt(clientId);
    } else {
      return error('clientId parameter is required', 400);
    }

    // Get InBody metrics which contain body measurements
    const measurements = await prisma.inbody_metrics.findMany({
      where: {
        customer_id: finalClientId,
        tenant_id: BigInt(user.tenant_id),
      },
      orderBy: { recorded_at: 'desc' },
      take: limit,
    });

    // Transform to expected format
    const entries = measurements.map(measurement => ({
      id: measurement.id.toString(),
      clientId: measurement.customer_id.toString(),
      metric: 'measurements',
      value: {
        height_cm: Number(measurement.height_cm),
        weight_kg: Number(measurement.weight_kg),
        bmi: Number(measurement.bmi),
        body_fat_percent: Number(measurement.body_fat_percent),
        muscle_mass_kg: Number(measurement.muscle_mass_kg),
        water_percent: Number(measurement.water_percent),
        visceral_fat_level: Number(measurement.visceral_fat_level),
        bmr_kcal: measurement.bmr_kcal,
        tdee_kcal: measurement.tdee_kcal,
      },
      date: measurement.recorded_at,
      notes: measurement.notes,
    }));

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
  try {
    const session = await getSession(req);
    const { user } = session;

    const { clientId, measurements, date, notes } = validatedBody;

    let finalClientId: bigint;
    if (user.role === 'client') {
      finalClientId = BigInt(user.id);
    } else if (!clientId) {
      return error('clientId is required', 400);
    } else {
      finalClientId = BigInt(clientId);
    }

    // Create InBody metrics entry
    const newEntry = await prisma.inbody_metrics.create({
      data: {
        tenant_id: BigInt(user.tenant_id),
        customer_id: finalClientId,
        recorded_at: date ? new Date(date) : new Date(),
        height_cm: measurements.height_cm,
        weight_kg: measurements.weight_kg,
        bmi: measurements.bmi,
        body_fat_percent: measurements.body_fat_percent,
        muscle_mass_kg: measurements.muscle_mass_kg,
        water_percent: measurements.water_percent,
        visceral_fat_level: measurements.visceral_fat_level,
        bmr_kcal: measurements.bmr_kcal,
        tdee_kcal: measurements.tdee_kcal,
        notes: notes,
      },
    });

    // Transform to expected format
    const response = {
      id: newEntry.id.toString(),
      clientId: newEntry.customer_id.toString(),
      metric: 'measurements',
      value: {
        height_cm: Number(newEntry.height_cm),
        weight_kg: Number(newEntry.weight_kg),
        bmi: Number(newEntry.bmi),
        body_fat_percent: Number(newEntry.body_fat_percent),
        muscle_mass_kg: Number(newEntry.muscle_mass_kg),
        water_percent: Number(newEntry.water_percent),
        visceral_fat_level: Number(newEntry.visceral_fat_level),
        bmr_kcal: newEntry.bmr_kcal,
        tdee_kcal: newEntry.tdee_kcal,
      },
      date: newEntry.recorded_at,
      notes: newEntry.notes,
    };

    return success(response, 201);
  } catch (err) {
    console.error('Failed to log measurements:', err);
    return error('Failed to log measurements', 500);
  }
};

export const POST = withValidation(createMeasurementSchema, postHandler);