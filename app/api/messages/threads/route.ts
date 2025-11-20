import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';
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
  try {
    const session = await getSession(req);
    const { user } = session;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Get conversations (message threads) from the database
    let whereClause: any = {
      tenant_id: BigInt(user.tenant_id),
    };

    // Filter based on role - for now, get all conversations for the tenant
    // In a more complex system, you'd filter by user relationships
    
    const conversations = await prisma.conversations.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        inbound_messages: {
          orderBy: { received_at: 'desc' },
          take: 1,
        },
        outbound_messages: {
          orderBy: { created_at: 'desc' },
          take: 1,
        },
      },
      orderBy: { last_activity_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.conversations.count({ where: whereClause });

    // Transform to expected format
    const threadsWithLastMessage = conversations.map((conversation) => {
      const lastInbound = conversation.inbound_messages[0];
      const lastOutbound = conversation.outbound_messages[0];
      
      // Determine which message is more recent
      const lastMessage = !lastInbound && !lastOutbound ? null :
        !lastInbound ? lastOutbound :
        !lastOutbound ? lastInbound :
        new Date(lastInbound.received_at) > new Date(lastOutbound.created_at) ? lastInbound : lastOutbound;

      return {
        id: conversation.id.toString(),
        clientId: conversation.customer_id.toString(),
        trainerId: null, // Could be derived from team member assignments
        channel: conversation.channel,
        createdAt: conversation.started_at,
        updatedAt: conversation.last_activity_at,
        customer: {
          id: conversation.customer.id.toString(),
          name: `${conversation.customer.first_name} ${conversation.customer.last_name}`,
        },
        lastMessage: lastMessage ? {
          id: lastMessage.id.toString(),
          text: (lastMessage as any).text || 'Message',
          sentAt: 'received_at' in lastMessage ? lastMessage.received_at : (lastMessage as any).created_at,
          direction: 'received_at' in lastMessage ? 'in' : 'out',
        } : null,
        messageCount: conversation.inbound_messages.length + conversation.outbound_messages.length,
      };
    });

    const pagination = {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
    };

    return success({ data: threadsWithLastMessage, pagination });
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
  try {
    const session = await getSession(req);
    const { user } = session;

    const { clientId, trainerId } = validatedBody;

    // Check if conversation already exists for this customer
    const existingConversation = await prisma.conversations.findFirst({
      where: {
        tenant_id: BigInt(user.tenant_id),
        customer_id: BigInt(clientId),
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

    if (existingConversation) {
      // Transform to expected format
      const response = {
        id: existingConversation.id.toString(),
        clientId: existingConversation.customer_id.toString(),
        trainerId: trainerId, // Store trainer assignment separately if needed
        channel: existingConversation.channel,
        createdAt: existingConversation.started_at,
        updatedAt: existingConversation.last_activity_at,
        customer: {
          id: existingConversation.customer.id.toString(),
          name: `${existingConversation.customer.first_name} ${existingConversation.customer.last_name}`,
        },
      };
      return success(response, 200);
    }

    // Create new conversation
    const newConversation = await prisma.conversations.create({
      data: {
        tenant_id: BigInt(user.tenant_id),
        customer_id: BigInt(clientId),
        channel: 'web', // Default to web channel
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

    // Transform to expected format
    const response = {
      id: newConversation.id.toString(),
      clientId: newConversation.customer_id.toString(),
      trainerId: trainerId,
      channel: newConversation.channel,
      createdAt: newConversation.started_at,
      updatedAt: newConversation.last_activity_at,
      customer: {
        id: newConversation.customer.id.toString(),
        name: `${newConversation.customer.first_name} ${newConversation.customer.last_name}`,
      },
    };

    return success(response, 201);
  } catch (err) {
    console.error('Failed to create thread:', err);
    return error('Failed to create thread', 500);
  }
};

export const POST = withValidation(createThreadSchema, postHandler);