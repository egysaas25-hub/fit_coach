import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { success, error, notFound } from '@/lib/utils/response';
import { database } from '@/lib/mock-db/database';
import { ensureDbInitialized } from '@/lib/db/init';

interface Webhook {
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
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const webhooks = database.getAll<Webhook>('webhooks');
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
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const body = await req.json();
    const { name, url, events } = body;

    if (!name || !url || !events || !Array.isArray(events)) {
      return error('Name, URL, and events array are required', 400);
    }

    const newWebhook = database.create<Webhook>('webhooks', {
      name,
      url,
      events,
      status: 'active',
      secret: `whsec_${Math.random().toString(36).substring(7)}`,
    });

    return success(newWebhook, 201);
  } catch (err) {
    console.error('Failed to create webhook:', err);
    return error('Failed to create webhook', 500);
  }
}