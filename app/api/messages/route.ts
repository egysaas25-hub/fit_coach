import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { database, Message, MessageThread } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { z } from 'zod';

const createMessageSchema = z.object({
  threadId: z.string().min(1, 'Thread ID is required'),
  content: z.string().min(1, 'Message content is required').max(1000),
});

/**
 * GET /api/messages
 * Get messages for a specific thread
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get('threadId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    if (!threadId) {
      return error('threadId parameter is required', 400);
    }

    // Check thread access
    const thread = database.get<MessageThread>('messageThreads', threadId);
    if (!thread) {
      return error('Thread not found', 404);
    }

    // Permission check
    const hasAccess =
      thread.clientId === user.id ||
      thread.trainerId === user.id ||
      user.role === 'admin' ||
      user.role === 'super-admin';

    if (!hasAccess) {
      return error("You don't have permission to view this thread", 403);
    }

    // Get messages
    let messages = database.query<Message>(
      'messages',
      (m) => m.threadId === threadId
    );

    // Sort by date (oldest first for chat)
    messages = database.sort(messages, 'createdAt', 'asc');

    // Limit
    messages = messages.slice(-limit); // Get last N messages

    return success(messages);
  } catch (err) {
    console.error('Failed to fetch messages:', err);
    return error('Failed to fetch messages', 500);
  }
}

/**
 * POST /api/messages
 * Send a new message
 */
const postHandler = async (req: NextRequest, validatedBody: any) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { threadId, content } = validatedBody;

    // Check thread exists and user has access
    const thread = database.get<MessageThread>('messageThreads', threadId);
    if (!thread) {
      return error('Thread not found', 404);
    }

    const hasAccess =
      thread.clientId === user.id ||
      thread.trainerId === user.id ||
      user.role === 'admin' ||
      user.role === 'super-admin';

    if (!hasAccess) {
      return error("You don't have permission to send messages in this thread", 403);
    }

    // Create message
    const newMessage = database.create<Message>('messages', {
      threadId,
      senderId: user.id,
      content,
    });

    // Update thread's updatedAt
    database.update<any>('messageThreads', threadId, {
      updatedAt: new Date(),
    });

    return success(newMessage, 201);
  } catch (err) {
    console.error('Failed to send message:', err);
    return error('Failed to send message', 500);
  }
};

export const POST = withValidation(createMessageSchema, postHandler);