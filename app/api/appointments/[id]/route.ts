import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/appointments/:id
 * Get a specific appointment
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession(req);
    const { user } = session;
    const appointmentId = BigInt(params.id);

    // Get appointment from interactions table
    const appointment = await prisma.interactions.findUnique({
      where: { 
        id: appointmentId,
        tenant_id: BigInt(user.tenant_id),
      },
      include: {
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        by_team_member: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    if (!appointment) {
      return notFound('Appointment');
    }

    // Permission check
    if (user.role === 'client' && appointment.customer_id.toString() !== user.id.toString()) {
      return forbidden("You don't have permission to view this appointment.");
    }
    if (user.role === 'trainer' && appointment.by_team_member_id?.toString() !== user.id.toString()) {
      return forbidden("You don't have permission to view this appointment.");
    }

    // Transform to expected format
    const metadata = appointment.meta as any || {};
    const response = {
      id: appointment.id.toString(),
      clientId: appointment.customer_id.toString(),
      trainerId: appointment.by_team_member_id?.toString(),
      date: metadata.scheduledAt || appointment.sent_at,
      status: metadata.status || 'scheduled',
      duration: metadata.duration || 60,
      notes: appointment.message_text,
      client: {
        id: appointment.customer.id.toString(),
        name: `${appointment.customer.first_name} ${appointment.customer.last_name}`,
      },
      trainer: appointment.by_team_member ? {
        id: appointment.by_team_member.id.toString(),
        name: appointment.by_team_member.full_name,
      } : null,
    };

    return success(response);
  } catch (err) {
    console.error('Failed to fetch appointment:', err);
    return error('Failed to fetch appointment', 500);
  }
}

/**
 * PATCH /api/appointments/:id
 * Update an appointment
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession(req);
    const { user } = session;
    const appointmentId = BigInt(params.id);

    // Get existing appointment
    const existingAppointment = await prisma.interactions.findUnique({
      where: { 
        id: appointmentId,
        tenant_id: BigInt(user.tenant_id),
      },
    });

    if (!existingAppointment) {
      return notFound('Appointment');
    }

    // Permission check
    if (user.role === 'client' && existingAppointment.customer_id.toString() !== user.id.toString()) {
      return forbidden("You don't have permission to update this appointment.");
    }
    if (user.role === 'trainer' && existingAppointment.by_team_member_id?.toString() !== user.id.toString()) {
      return forbidden("You don't have permission to update this appointment.");
    }

    const body = await req.json();
    
    // Update appointment metadata
    const currentMetadata = existingAppointment.meta as any || {};
    const updatedMetadata = {
      ...currentMetadata,
      scheduledAt: body.date ? new Date(body.date) : currentMetadata.scheduledAt,
      status: body.status || currentMetadata.status,
      duration: body.duration || currentMetadata.duration,
    };

    const updatedAppointment = await prisma.interactions.update({
      where: { id: appointmentId },
      data: {
        message_text: body.notes || existingAppointment.message_text,
        meta: updatedMetadata,
        sent_at: body.date ? new Date(body.date) : existingAppointment.sent_at,
      },
      include: {
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        by_team_member: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    // Transform to expected format
    const metadata = updatedAppointment.meta as any || {};
    const response = {
      id: updatedAppointment.id.toString(),
      clientId: updatedAppointment.customer_id.toString(),
      trainerId: updatedAppointment.by_team_member_id?.toString(),
      date: metadata.scheduledAt || updatedAppointment.sent_at,
      status: metadata.status || 'scheduled',
      duration: metadata.duration || 60,
      notes: updatedAppointment.message_text,
      client: {
        id: updatedAppointment.customer.id.toString(),
        name: `${updatedAppointment.customer.first_name} ${updatedAppointment.customer.last_name}`,
      },
      trainer: updatedAppointment.by_team_member ? {
        id: updatedAppointment.by_team_member.id.toString(),
        name: updatedAppointment.by_team_member.full_name,
      } : null,
    };

    return success(response);
  } catch (err) {
    console.error('Failed to update appointment:', err);
    return error('Failed to update appointment', 500);
  }
}

/**
 * DELETE /api/appointments/:id
 * Delete an appointment
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession(req);
    const { user } = session;
    const appointmentId = BigInt(params.id);

    // Get existing appointment
    const existingAppointment = await prisma.interactions.findUnique({
      where: { 
        id: appointmentId,
        tenant_id: BigInt(user.tenant_id),
      },
    });

    if (!existingAppointment) {
      return notFound('Appointment');
    }

    // Permission check - only trainers and admins can delete
    if (user.role === 'client') {
      return forbidden("Clients cannot delete appointments.");
    }
    if (user.role === 'trainer' && existingAppointment.by_team_member_id?.toString() !== user.id.toString()) {
      return forbidden("You can only delete your own appointments.");
    }

    // Delete appointment
    await prisma.interactions.delete({
      where: { id: appointmentId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Failed to delete appointment:', err);
    return error('Failed to delete appointment', 500);
  }
}