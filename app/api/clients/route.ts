import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { success, paginatedSuccess, error, unauthorized, forbidden } from '@/lib/utils/response';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { createClientSchema } from '@/lib/schemas/client/client.schema';
import { hashPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/clients
 * Retrieves a list of clients.
 * - Trainers can see their assigned clients.
 * - Admins can see all clients.
 */
export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { user } = authResult;

  const roleCheck = requireRole(user, ['trainer', 'admin', 'super-admin']);
  if (roleCheck) {
    return roleCheck;
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';

    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    let query: any = {
      where: {
        tenant_id: tenantId
      },
      include: {
        subscriptions: true
      }
    };

    // Filter based on role
    if (user.role === 'trainer') {
      // In the current schema, there's no direct trainer-client relationship
      // For now, we'll just get all clients since we don't have trainer-client relationships set up
      // In a real implementation, you would filter by the trainer's clients
    }

    // Search
    if (search) {
      query.where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { phone_e164: { contains: search, mode: 'insensitive' } }
      ];
    }

    let clients = await prisma.customers.findMany(query);

    const total = clients.length;
    const paginatedClients = clients.slice((page - 1) * limit, page * limit);

    // Format response
    const formattedClients = paginatedClients.map((client: any) => ({
      id: client.id.toString(),
      name: `${client.first_name || ''} ${client.last_name || ''}`.trim(),
      email: '', // Clients don't have email in the current schema
      phone: client.phone_e164,
      role: 'client',
      status: client.status,
      source: client.source,
      subscriptions: client.subscriptions ? client.subscriptions.map((sub: any) => ({
        id: sub.id.toString(),
        planCode: sub.plan_code,
        status: sub.status,
        startAt: sub.start_at,
        renewAt: sub.renew_at,
        cancelAt: sub.cancel_at
      })) : [],
      createdAt: client.created_at,
      updatedAt: client.updated_at
    }));

    return paginatedSuccess(formattedClients, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Failed to fetch clients:', err);
    return error('An unexpected error occurred while fetching clients.', 500);
  }
}

/**
 * POST /api/clients
 * Creates a new client.
 * - Accessible by Trainers and Admins.
 */
const postHandler = async (req: NextRequest, validatedBody: any) => {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { user } = authResult;

  const roleCheck = requireRole(user, ['trainer', 'admin', 'super-admin']);
  if (roleCheck) {
    return roleCheck;
  }

  try {
    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    // Check if client exists
    const existingClient = await prisma.customers.findUnique({
      where: {
        uq_customer_phone: {
          tenant_id: tenantId,
          phone_e164: validatedBody.phone
        }
      }
    });

    if (existingClient) {
      return error('A client with this phone number already exists.', 409); // 409 Conflict
    }

    // Create client
    const [firstName, ...lastNameParts] = validatedBody.name.split(' ');
    const lastName = lastNameParts.join(' ') || '';

    const newClient = await prisma.customers.create({
      data: {
        tenant_id: tenantId,
        phone_e164: validatedBody.phone,
        first_name: firstName,
        last_name: lastName,
        source: 'sales', // Use 'sales' as source for manually created clients
        status: 'lead'
      }
    });

    // Format response
    const clientResponse = {
      id: newClient.id.toString(),
      name: `${newClient.first_name || ''} ${newClient.last_name || ''}`.trim(),
      email: '', // Clients don't have email in the current schema
      phone: newClient.phone_e164,
      role: 'client',
      status: newClient.status,
      source: newClient.source,
      subscriptions: [],
      createdAt: newClient.created_at,
      updatedAt: newClient.updated_at
    };

    return success(clientResponse, 201);
  } catch (err) {
    console.error('Failed to create client:', err);
    return error('An unexpected error occurred while creating the client.', 500);
  }
};

export const POST = withValidation(createClientSchema, postHandler);