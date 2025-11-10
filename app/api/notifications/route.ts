import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { database, Notification } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { z } from 'zod';

const createNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  message: z.string().min(1, 'Message is required').max(500),
  type: z.enum(['info', 'success', 'warning', 'error']).optional(),
});

/**
 * GET /api/notifications
 * Get notifications for current user
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let notifications = database.query<Notification>(
      'notifications',
      (n) => n.userId === user.id
    );

    // Filter unread only
    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.read);
    }

    // Sort by date (newest first)
    notifications = database.sort(notifications, 'createdAt', 'desc');

    // Limit
    notifications = notifications.slice(0, limit);

    const unreadCount = database.query<Notification>(
      'notifications',
      (n) => n.userId === user.id && !n.read
    ).length;

    return success({
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
    return error('Failed to fetch notifications', 500);
  }
}

/**
 * POST /api/notifications
 * Create a new notification (admin/system only)
 */
const postHandler = async (req: NextRequest, validatedBody: any) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  // Only admins can create notifications
  if (user.role !== 'admin' && user.role !== 'super-admin') {
    return error('Only admins can create notifications', 403);
  }

  try {
    const { userId, message, type } = validatedBody;

    const newNotification = database.create<Notification>('notifications', {
      userId,
      message,
      read: false,
    });

    return success(newNotification, 201);
  } catch (err) {
    console.error('Failed to create notification:', err);
    return error('Failed to create notification', 500);
  }
};

export const POST = withValidation(createNotificationSchema, postHandler);