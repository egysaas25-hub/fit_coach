import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { database, Appointment } from '@/lib/mock-db/database';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/appointments/:id
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
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
}

/**
 * PATCH /api/appointments/:id
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
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

    const body = await req.json();

    // Clients can only cancel, not change details
    if (user.role === 'client' && Object.keys(body).length > 1) {
      if (!body.status || body.status !== 'cancelled') {
        return forbidden('Clients can only cancel appointments.');
      }
    }

    // Don't allow changing client or trainer
    delete body.clientId;
    delete body.trainerId;

    const updated = database.update('appointments', params.id, body);
    if (!updated) return error('Failed to update appointment', 500);

    return success(updated);
  } catch (err) {
    console.error('Failed to update appointment:', err);
    return error('Failed to update appointment', 500);
  }
}

/**
 * DELETE /api/appointments/:id
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
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
}