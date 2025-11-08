import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { database, Notification } from '@/lib/mock-db/database';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

interface RouteParams {
  params: { id: string };
}

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const notification = database.get<Notification>('notifications', params.id);
    if (!notification) return notFound('Notification');

    // Permission check - users can only mark their own notifications as read
    if (notification.userId !== user.id) {
      return forbidden("You don't have permission to modify this notification.");
    }

    const updated = database.update('notifications', params.id, { read: true });
    if (!updated) return error('Failed to update notification', 500);

    return success(updated);
  } catch (err) {
    console.error('Failed to mark notification as read:', err);
    return error('Failed to mark notification as read', 500);
  }
}