import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, Appointment } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { z } from 'zod';

const createAppointmentSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  trainerId: z.string().min(1, 'Trainer ID is required').optional(),
  date: z.string().datetime('Invalid date format'),
  duration: z.number().min(15).max(240).default(60), // 15 min to 4 hours
  type: z.enum(['consultation', 'training', 'check-in']).optional(),
  notes: z.string().max(500).optional(),
});

/**
 * GET /api/appointments
 * Get appointments
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const trainerId = searchParams.get('trainerId');
    const status = searchParams.get('status');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let appointments = database.getAll<Appointment>('appointments');

    // Filter based on role
    if (user.role === 'client') {
      appointments = appointments.filter((a) => a.clientId === user.id);
    } else if (user.role === 'trainer') {
      appointments = appointments.filter((a) => a.trainerId === user.id);
    }

    // Apply filters
    if (clientId) {
      appointments = appointments.filter((a) => a.clientId === clientId);
    }
    if (trainerId) {
      appointments = appointments.filter((a) => a.trainerId === trainerId);
    }
    if (status) {
      appointments = appointments.filter((a) => a.status === status);
    }
    if (fromDate) {
      const from = new Date(fromDate);
      appointments = appointments.filter((a) => new Date(a.date) >= from);
    }
    if (toDate) {
      const to = new Date(toDate);
      appointments = appointments.filter((a) => new Date(a.date) <= to);
    }

    // Sort by date (upcoming first)
    appointments = database.sort(appointments, 'date', 'asc');

    // Paginate
    const result = database.paginate(appointments, page, limit);

    return success({ data: result.data, pagination: result.pagination });
  } catch (err) {
    console.error('Failed to fetch appointments:', err);
    return error('Failed to fetch appointments', 500);
  }
}

/**
 * POST /api/appointments
 * Create new appointment
 */
const postHandler = async (req: NextRequest, validatedBody: any) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { clientId, trainerId, date, duration, type, notes } = validatedBody;

    // Determine trainer ID
    let finalTrainerId = trainerId;
    if (user.role === 'trainer') {
      finalTrainerId = user.id;
    } else if (!trainerId) {
      return error('Trainer ID is required', 400);
    }

    // Check for conflicts (same trainer, overlapping time)
    const appointmentDate = new Date(date);
    const endTime = new Date(appointmentDate.getTime() + duration * 60000);

    const conflicts = database.query<Appointment>('appointments', (a) => {
      if (a.trainerId !== finalTrainerId) return false;
      if (a.status === 'cancelled') return false;

      const aStart = new Date(a.date);
      const aEnd = new Date(aStart.getTime() + 60 * 60000); // Assume 1 hour default

      return (
        (appointmentDate >= aStart && appointmentDate < aEnd) ||
        (endTime > aStart && endTime <= aEnd) ||
        (appointmentDate <= aStart && endTime >= aEnd)
      );
    });

    if (conflicts.length > 0) {
      return error('Trainer has a conflicting appointment at this time', 409);
    }

    const newAppointment = database.create<Appointment>('appointments', {
      clientId,
      trainerId: finalTrainerId,
      date: appointmentDate,
      status: 'scheduled',
      type: type || 'training',
      notes,
    });

    return success(newAppointment, 201);
  } catch (err) {
    console.error('Failed to create appointment:', err);
    return error('Failed to create appointment', 500);
  }
};

export const POST = withValidation(createAppointmentSchema, postHandler);