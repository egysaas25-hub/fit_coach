import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { success, error } from '@/lib/utils/response';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const createMessageSchema = z.object({
  threadId: z.string().min(1, 'Thread ID is required'),
  content: z.string().min(1, 'Message content is required').max(1000),
});

/**
 * GET /api/messages
 * Get messages for a specific thread
 */
export async function GET(req: NextRequest) {
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

    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    // Check thread access
    const thread = await prisma.conversations.findUnique({
      where: {
        id: BigInt(threadId),
        tenant_id: tenantId
      },
      include: {
        customer: true
      }
    });

    if (!thread) {
      return error('Thread not found', 404);
    }

    // Permission check
    const hasAccess =
      thread.customer_id.toString() === user.id ||
      thread.customer_id.toString() === user.id || // This should be trainer ID in a real implementation
      user.role === 'admin' ||
      user.role === 'super-admin';

    if (!hasAccess) {
      return error("You don't have permission to view this thread", 403);
    }

    // Get messages
    let messages = await prisma.inbound_messages.findMany({
      where: {
        conversation_id: BigInt(threadId),
        tenant_id: tenantId
      },
      orderBy: {
        received_at: 'asc'
      },
      take: limit
    });

    // Format response
    const formattedMessages = messages.map(msg => ({
      id: msg.id.toString(),
      threadId: msg.conversation_id?.toString() || '',
      senderId: msg.customer_id.toString(),
      content: msg.text || '',
      createdAt: msg.received_at,
      updatedAt: msg.received_at
    }));

    return success(formattedMessages);
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
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { threadId, content } = validatedBody;

    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    // Check thread exists and user has access
    const thread = await prisma.conversations.findUnique({
      where: {
        id: BigInt(threadId),
        tenant_id: tenantId
      },
      include: {
        customer: true
      }
    });

    if (!thread) {
      return error('Thread not found', 404);
    }

    const hasAccess =
      thread.customer_id.toString() === user.id ||
      thread.customer_id.toString() === user.id || // This should be trainer ID in a real implementation
      user.role === 'admin' ||
      user.role === 'super-admin';

    if (!hasAccess) {
      return error("You don't have permission to send messages in this thread", 403);
    }

    // Create message
    const newMessage = await prisma.inbound_messages.create({
      data: {
        tenant_id: tenantId,
        conversation_id: BigInt(threadId),
        customer_id: BigInt(user.id),
        text: content,
        received_at: new Date()
      }
    });

    // Update thread's last_activity_at
    await prisma.conversations.update({
      where: {
        id: BigInt(threadId)
      },
      data: {
        last_activity_at: new Date()
      }
    });

    // Format response
    const messageResponse = {
      id: newMessage.id.toString(),
      threadId: newMessage.conversation_id?.toString() || '',
      senderId: newMessage.customer_id.toString(),
      content: newMessage.text || '',
      createdAt: newMessage.received_at,
      updatedAt: newMessage.received_at
    };

    return success(messageResponse, 201);
  } catch (err) {
    console.error('Failed to send message:', err);
    return error('Failed to send message', 500);
  }
};

export const POST = withValidation(createMessageSchema, postHandler);