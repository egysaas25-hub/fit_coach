import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, Client } from '@/lib/mock-db/database';
import { success, error, notFound, forbidden } from '@/lib/utils/response';

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

  return success(client);
}

/**
 * PATCH /api/clients/[id]
 * Updates a client's information.
 * - A client can update their own profile (limited fields).
 * - A trainer can update their assigned clients.
 * - An admin can update any client.
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
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
    const body = await req.json();

    // In a real application, you would implement field-level security.
    // For example, a client can't change their own trainerId.
    if (user.role === 'client' && 'trainerId' in body) {
        return forbidden("Clients cannot change their assigned trainer.");
    }

    const updatedClient = database.update('clients', id, body);
    return success(updatedClient);
  } catch (err) {
    console.error('Failed to update client:', err);
    return error('An unexpected error occurred while updating the client.', 500);
  }
}

/**
 * DELETE /api/clients/[id]
 * Deletes a client.
 * - Accessible only by Admins.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
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
