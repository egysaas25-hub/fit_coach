import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { success, error, notFound } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

// Webhook interface for response formatting
interface WebhookResponse {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secret: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * GET /api/webhooks
 * Get all webhooks (Admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(req, ['admin']);
    const { user } = session;

    // Get webhook subscriptions for this tenant
    const webhookSubscriptions = await prisma.webhook_subscriptions.findMany({
      where: {
        integration_account: {
          tenant_id: BigInt(user.tenant_id),
        },
      },
      include: {
        integration_account: {
          include: {
            integration: true,
          },
        },
      },
    });

    // Transform to expected webhook format
    const webhooks: WebhookResponse[] = webhookSubscriptions.map((subscription) => ({
      id: subscription.id.toString(),
      name: `${subscription.integration_account.integration.name} - ${subscription.topic}`,
      url: subscription.callback_url,
      events: [subscription.topic], // Single topic per subscription
      status: subscription.is_active ? 'active' : 'inactive',
      secret: subscription.secret_ref || 'hidden',
      createdAt: subscription.created_at,
      updatedAt: subscription.created_at, // No updated_at field in current schema
    }));

    return success(webhooks);
  } catch (err) {
    console.error('Failed to fetch webhooks:', err);
    return error('Failed to fetch webhooks', 500);
  }
}

/**
 * POST /api/webhooks
 * Create a new webhook (Admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, ['admin']);
    const { user } = session;

    const body = await req.json();
    const { name, url, events, integrationName } = body;

    if (!name || !url || !events || !Array.isArray(events)) {
      return error('Name, URL, and events array are required', 400);
    }

    // Find or create integration
    let integration = await prisma.integrations.findFirst({
      where: {
        tenant_id: BigInt(user.tenant_id),
        name: integrationName || 'Custom Webhook',
      },
    });

    if (!integration) {
      integration = await prisma.integrations.create({
        data: {
          tenant_id: BigInt(user.tenant_id),
          name: integrationName || 'Custom Webhook',
          provider: 'webhook',
          type: 'other',
          is_enabled: true,
        },
      });
    }

    // Create integration account
    const integrationAccount = await prisma.integration_accounts.create({
      data: {
        tenant_id: BigInt(user.tenant_id),
        integration_id: integration.id,
        account_name: name,
        auth_type: 'none',
        is_default: false,
        is_enabled: true,
      },
    });

    // Create webhook subscriptions for each event
    const webhookSubscriptions = await Promise.all(
      events.map((event: string) =>
        prisma.webhook_subscriptions.create({
          data: {
            integration_account_id: integrationAccount.id,
            topic: event,
            callback_url: url,
            secret_ref: `whsec_${Math.random().toString(36).substring(7)}`,
            is_active: true,
          },
        })
      )
    );

    // Transform to expected format (return first subscription as representative)
    const firstSubscription = webhookSubscriptions[0];
    const response: WebhookResponse = {
      id: firstSubscription.id.toString(),
      name: name,
      url: firstSubscription.callback_url,
      events: events,
      status: 'active',
      secret: firstSubscription.secret_ref || 'hidden',
      createdAt: firstSubscription.created_at,
      updatedAt: firstSubscription.created_at,
    };

    return success(response, 201);
  } catch (err) {
    console.error('Failed to create webhook:', err);
    return error('Failed to create webhook', 500);
  }
}