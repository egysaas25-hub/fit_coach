import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { database, Appointment } from '@/lib/mock-db/database';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { z } from 'zod';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/appointments/:id
 */
const getHandler = async (req: NextRequest, { params }: RouteParams) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const appointment = database.get<Appointment>('appointments', params.id);
    if (!appointment) return notFound('Appointment');

    // Permission check
    const isClient = user.role === 'client' && appointment.clientId === user.id;
    const isTrainer = user.role === 'trainer' && appointment.trainerId === user.id;
const isAdmin = user.role === 'admin' || user.role === 'super-admin';

    if (!isClient && !isTrainer && !isAdmin) {
      return forbidden("You don't have permission to view this appointment.");
    }

    return success(appointment);
  } catch (err) {
    console.error('Failed to fetch appointment:', err);
    return error('Failed to fetch appointment', 500);
  }
};

export const GET = withLogging(getHandler);

/**
 * PATCH /api/appointments/:id
 */
const updateAppointmentSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
  date: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
});

const patchHandler = async (
  req: NextRequest,
  validatedBody: any,
  { params }: RouteParams
) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const appointment = database.get<Appointment>('appointments', params.id);
    if (!appointment) return notFound('Appointment');

    // Permission check
    const isClient = user.role === 'client' && appointment.clientId === user.id;
    const isTrainer = user.role === 'trainer' && appointment.trainerId === user.id;
    const isAdmin = user.role === 'admin' || user.role === 'super-admin';

    if (!isClient && !isTrainer && !isAdmin) {
      return forbidden("You don't have permission to update this appointment.");
    }

    // Clients can only cancel, not change details
    const keys = Object.keys(validatedBody || {});
    if (user.role === 'client' && keys.length > 1) {
      if (!validatedBody.status || validatedBody.status !== 'cancelled') {
        return forbidden('Clients can only cancel appointments.');
      }
    }

    // Don't allow changing client or trainer
    delete validatedBody.clientId;
    delete validatedBody.trainerId;

    const updated = database.update('appointments', params.id, validatedBody);
    if (!updated) return error('Failed to update appointment', 500);

    return success(updated);
  } catch (err) {
    console.error('Failed to update appointment:', err);
    return error('Failed to update appointment', 500);
  }
};

export const PATCH = withLogging(withValidation(updateAppointmentSchema, patchHandler));

/**
 * DELETE /api/appointments/:id
 */
const deleteHandler = async (req: NextRequest, { params }: RouteParams) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const appointment = database.get<Appointment>('appointments', params.id);
    if (!appointment) return notFound('Appointment');

    // Only trainers and admins can delete
    const isTrainer = user.role === 'trainer' && appointment.trainerId === user.id;
    const isAdmin = user.role === 'admin' || user.role === 'super-admin';

    if (!isTrainer && !isAdmin) {
      return forbidden("You don't have permission to delete this appointment.");
    }

    const deleted = database.delete('appointments', params.id);
    if (!deleted) return error('Failed to delete appointment', 500);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Failed to delete appointment:', err);
    return error('Failed to delete appointment', 500);
  }
};

export const DELETE = withLogging(deleteHandler);