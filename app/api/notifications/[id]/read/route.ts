import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession(req);
    const { user } = session;
    const notificationId = BigInt(params.id);

    // For notifications, we'll use the outbound_messages table as a notification system
    // In a production system, you'd have a dedicated notifications table
    const notification = await prisma.outbound_messages.findUnique({
      where: { id: notificationId },
      include: {
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!notification) return notFound('Notification');

    // Permission check - users can only mark notifications for their tenant
    if (Number(notification.tenant_id) !== user.tenant_id) {
      return forbidden("You don't have permission to modify this notification.");
    }

    // Mark as read by updating the status (using sent status to indicate read)
    const updated = await prisma.outbound_messages.update({
      where: { id: notificationId },
      data: { 
        status: 'sent',
        sent_at: new Date(),
      },
      include: {
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    // Transform to expected notification format
    const response = {
      id: updated.id.toString(),
      userId: updated.customer_id.toString(),
      message: updated.text || 'Notification',
      read: updated.status === 'sent',
      createdAt: updated.created_at,
      customer: {
        id: updated.customer.id.toString(),
        name: `${updated.customer.first_name} ${updated.customer.last_name}`,
      },
    };

    return success(response);
  } catch (err) {
    console.error('Failed to mark notification as read:', err);
    return error('Failed to mark notification as read', 500);
  }
}