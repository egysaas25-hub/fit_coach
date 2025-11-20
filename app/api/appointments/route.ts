import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';
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
  try {
    const session = await getSession(req);
    const { user } = session;

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const trainerId = searchParams.get('trainerId');
    const status = searchParams.get('status');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Build where clause for appointment-like interactions
    const whereClause: any = {
      tenant_id: BigInt(user.tenant_id),
      // Filter for appointment-related interactions
    };

    // Filter based on role
    if (user.role === 'client') {
      whereClause.customer_id = BigInt(user.id);
    } else if (user.role === 'trainer') {
      whereClause.by_team_member_id = BigInt(user.id);
    }

    // Apply additional filters
    if (clientId) {
      whereClause.customer_id = BigInt(clientId);
    }
    if (trainerId) {
      whereClause.by_team_member_id = BigInt(trainerId);
    }

    // Date range filter
    if (fromDate || toDate) {
      whereClause.sent_at = {};
      if (fromDate) whereClause.sent_at.gte = new Date(fromDate);
      if (toDate) whereClause.sent_at.lte = new Date(toDate);
    }

    // Get appointments using interactions table
    const appointments = await prisma.interactions.findMany({
      where: whereClause,
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
      orderBy: { sent_at: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count
    const totalCount = await prisma.interactions.count({ where: whereClause });

    // Transform to expected format
    const transformedAppointments = appointments.map(interaction => {
      const metadata = interaction.meta as any || {};
      return {
        id: interaction.id.toString(),
        clientId: interaction.customer_id.toString(),
        trainerId: interaction.by_team_member_id?.toString(),
        date: metadata.scheduledAt || interaction.sent_at,
        status: metadata.status || 'scheduled',
        duration: metadata.duration || 60,
        notes: interaction.message_text,
        client: {
          id: interaction.customer.id.toString(),
          name: `${interaction.customer.first_name} ${interaction.customer.last_name}`,
        },
        trainer: interaction.by_team_member ? {
          id: interaction.by_team_member.id.toString(),
          name: interaction.by_team_member.full_name,
        } : null,
      };
    });

    const pagination = {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
    };

    return success({ data: transformedAppointments, pagination });
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
  try {
    const session = await getSession(req);
    const { user } = session;

    const { clientId, trainerId, date, duration, type, notes } = validatedBody;

    // Determine trainer ID
    let finalTrainerId = trainerId;
    if (user.role === 'trainer') {
      finalTrainerId = user.id;
    } else if (!trainerId) {
      return error('Trainer ID is required', 400);
    }

    // Verify client and trainer exist
    const [client, trainer] = await Promise.all([
      prisma.customers.findUnique({
        where: { id: BigInt(clientId) },
        select: { id: true, first_name: true, last_name: true },
      }),
      prisma.team_members.findUnique({
        where: { id: BigInt(finalTrainerId) },
        select: { id: true, full_name: true },
      }),
    ]);

    if (!client) {
      return error('Client not found', 404);
    }
    if (!trainer) {
      return error('Trainer not found', 404);
    }

    // Create appointment using interactions table
    const newAppointment = await prisma.interactions.create({
      data: {
        tenant_id: BigInt(user.tenant_id),
        customer_id: BigInt(clientId),
        by_team_member_id: BigInt(finalTrainerId),
        channel: 'web',
        direction: 'out',
        sent_at: new Date(date),
        message_text: notes || '',
        meta: {
          scheduledAt: new Date(date),
          duration: duration || 60,
          status: 'scheduled',
          type: type || 'training',
        },
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
    const metadata = newAppointment.meta as any || {};
    const response = {
      id: newAppointment.id.toString(),
      clientId: newAppointment.customer_id.toString(),
      trainerId: newAppointment.by_team_member_id?.toString(),
      date: metadata.scheduledAt || newAppointment.sent_at,
      status: metadata.status || 'scheduled',
      duration: metadata.duration || 60,
      type: metadata.type || 'training',
      notes: newAppointment.message_text,
      client: {
        id: newAppointment.customer.id.toString(),
        name: `${newAppointment.customer.first_name} ${newAppointment.customer.last_name}`,
      },
      trainer: newAppointment.by_team_member ? {
        id: newAppointment.by_team_member.id.toString(),
        name: newAppointment.by_team_member.full_name,
      } : null,
    };

    return success(response, 201);
  } catch (err) {
    console.error('Failed to create appointment:', err);
    return error('Failed to create appointment', 500);
  }
};

export const POST = withValidation(createAppointmentSchema, postHandler);