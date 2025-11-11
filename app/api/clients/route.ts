import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database } from '@/lib/mock-db/database';
import { Client } from '@/types/lib/mock-db/types';
import { success, paginatedSuccess, error, unauthorized, forbidden } from '@/lib/utils/response';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { createClientSchema } from '@/lib/schemas/client/client.schema';
import { hashPassword } from '@/lib/auth/password';
import { ensureDbInitialized } from '@/lib/db/init';

/**
 * GET /api/clients
 * Retrieves a list of clients.
 * - Trainers can see their assigned clients.
 * - Admins can see all clients.
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
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

    let clients: Client[];

    if (user.role === 'trainer') {
      // Trainers only see their clients
      clients = database.query('clients', (c) => c.trainerId === user.id);
    } else {
      // Admins see all clients
      clients = database.getAll('clients');
    }

    if (search) {
      clients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));
    }

    const total = clients.length;
    const paginatedClients = clients.slice((page - 1) * limit, page * limit);

    return paginatedSuccess(paginatedClients, { page, limit, total, pages: Math.ceil(total / limit) });
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
    ensureDbInitialized();
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
        const existingClient = database.query<Client>('clients', (c: Client) => c.email === validatedBody.email)[0];
        if (existingClient) {
        return error('A client with this email already exists.', 409); // 409 Conflict
        }

        const newClientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
            ...validatedBody,
            role: 'client',
            passwordHash: hashPassword('password123'), // Default password for new clients
            trainerId: user.role === 'trainer' ? user.id : validatedBody.trainerId, // Assign trainer if creator is one
        };

        const newClient = database.create('clients', newClientData);
        const { passwordHash, ...clientResponse } = newClient;

        return success(clientResponse, 201);
    } catch (err) {
        console.error('Failed to create client:', err);
        return error('An unexpected error occurred while creating the client.', 500);
    }
};

export const POST = withValidation(createClientSchema, postHandler);
