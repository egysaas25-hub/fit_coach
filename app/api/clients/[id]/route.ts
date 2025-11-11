import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database } from '@/lib/mock-db/database';
import { Client } from '@/types/lib/mock-db/types';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { updateClientSchema } from '@/lib/schemas/client/client.schema';
import { ensureDbInitialized } from '@/lib/db/init';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/clients/[id]
 * Retrieves a single client by their ID.
 * - A client can view their own profile.
 * - A trainer can view their assigned clients.
 * - An admin can view any client.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { user } = authResult;
  const { id } = params;

  const client = database.get<Client>('clients', id);
  if (!client) {
    return notFound('Client');
  }

  // Permission check
  const isOwner = user.role === 'client' && user.id === client.id;
  const isAssignedTrainer = user.role === 'trainer' && client.trainerId === user.id;
  const isAdmin = user.role === 'admin' || user.role === 'super-admin';

  if (!isOwner && !isAssignedTrainer && !isAdmin) {
    return forbidden("You don't have permission to view this client.");
  }

  const { passwordHash, ...clientResponse } = client;
  return success(clientResponse);
}

/**
 * PATCH /api/clients/[id]
 * Updates a client's information.
 * - A client can update their own profile (limited fields).
 * - A trainer can update their assigned clients.
 * - An admin can update any client.
 */
const patchHandler = async (req: NextRequest, validatedBody: any, { params }: RouteParams) => {
    ensureDbInitialized();
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
        return authResult;
    }
    const { user } = authResult;
    const { id } = params;

    const client = database.get<Client>('clients', id);
    if (!client) {
        return notFound('Client');
    }

    // Permission check
    const isOwner = user.role === 'client' && user.id === client.id;
    const isAssignedTrainer = user.role === 'trainer' && client.trainerId === user.id;
    const isAdmin = user.role === 'admin' || user.role === 'super-admin';

    if (!isOwner && !isAssignedTrainer && !isAdmin) {
        return forbidden("You don't have permission to update this client.");
    }

    try {
        if (user.role === 'client' && 'trainerId' in validatedBody) {
            return forbidden("Clients cannot change their assigned trainer.");
        }

        const updatedClient = database.update<Client>('clients', id, validatedBody);
        if (updatedClient) {
          const { passwordHash, ...clientResponse } = updatedClient;
          return success(clientResponse);
        } else {
          return error('Failed to update client', 500);
        }
    } catch (err) {
        console.error('Failed to update client:', err);
        return error('An unexpected error occurred while updating the client.', 500);
    }
};
export const PATCH = withValidation(updateClientSchema, patchHandler);

/**
 * DELETE /api/clients/[id]
 * Deletes a client.
 * - Accessible only by Admins.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { user } = authResult;
  const { id } = params;

  const roleCheck = requireRole(user, ['admin', 'super-admin']);
  if (roleCheck) {
    return roleCheck;
  }

  const client = database.get<Client>('clients', id);
  if (!client) {
    return notFound('Client');
  }

  const deleted = database.delete('clients', id);
  if (deleted) {
    // Return a 204 No Content response for successful deletion
    return new NextResponse(null, { status: 204 });
  } else {
    return error('Failed to delete the client.', 500);
  }
}
