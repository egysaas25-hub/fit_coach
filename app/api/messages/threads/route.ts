import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { database, MessageThread } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { z } from 'zod';

const createThreadSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  trainerId: z.string().min(1, 'Trainer ID is required'),
});

/**
 * GET /api/messages/threads
 * Get message threads
 */
const getHandler = async (req: NextRequest) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let threads = database.getAll<MessageThread>('messageThreads');

    // Filter based on role
    if (user.role === 'client') {
      threads = threads.filter((t) => t.clientId === user.id);
    } else if (user.role === 'trainer') {
      threads = threads.filter((t) => t.trainerId === user.id);
    }

    // Sort by last update (newest first)
    threads = database.sort(threads, 'updatedAt', 'desc');

    // Get last message for each thread
    const threadsWithLastMessage = threads.map((thread) => {
      const messages = database.query('messages', (m: any) => m.threadId === thread.id);
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

      return {
        ...thread,
        lastMessage,
        messageCount: messages.length,
      };
    });

    // Paginate
    const result = database.paginate(threadsWithLastMessage, page, limit);

    return success({ data: result.data, pagination: result.pagination });
  } catch (err) {
    console.error('Failed to fetch threads:', err);
    return error('Failed to fetch threads', 500);
  }
};

export const GET = withLogging(getHandler);

/**
 * POST /api/messages/threads
 * Create a new message thread
 */
const postHandler = async (req: NextRequest, validatedBody: any) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { clientId, trainerId } = validatedBody;

    // Check if thread already exists
    const existingThread = database.query<MessageThread>(
      'messageThreads',
      (t) => t.clientId === clientId && t.trainerId === trainerId
    )[0];

    if (existingThread) {
      return success(existingThread, 200);
    }

    // Create new thread
    const newThread = database.create<MessageThread>('messageThreads', {
      clientId,
      trainerId,
    });

    return success(newThread, 201);
  } catch (err) {
    console.error('Failed to create thread:', err);
    return error('Failed to create thread', 500);
  }
};

export const POST = withValidation(createThreadSchema, postHandler);