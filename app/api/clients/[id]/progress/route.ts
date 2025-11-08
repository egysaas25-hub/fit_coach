import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, ProgressEntry, Client } from '@/lib/mock-db/database';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/clients/:id/progress
 * Get all progress for a specific client
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;
  const { id } = params;

  try {
    // Check if client exists
    const client = database.get<Client>('clients', id);
    if (!client) return notFound('Client');

    // Permission check
    const isOwner = user.role === 'client' && user.id === id;
    const isAssignedTrainer = user.role === 'trainer' && client.trainerId === user.id;
    const isAdmin = user.role === 'admin' || user.role === 'super-admin';

    if (!isOwner && !isAssignedTrainer && !isAdmin) {
      return forbidden("You don't have permission to view this client's progress.");
    }

    // Get all progress entries
    const entries = database.query<ProgressEntry>(
      'progressEntries',
      (e) => e.clientId === id
    );

    // Sort by date (newest first)
    const sortedEntries = database.sort(entries, 'date', 'desc');

    // Group by metric type
    const grouped = {
      weight: sortedEntries.filter((e) => e.metric === 'weight'),
      bodyfat: sortedEntries.filter((e) => e.metric === 'bodyfat'),
      measurements: sortedEntries.filter((e) => e.metric === 'measurements'),
      photos: sortedEntries.filter((e) => e.metric === 'photo'),
    };

    return success({
      clientId: id,
      total: entries.length,
      byMetric: grouped,
      recent: sortedEntries.slice(0, 10),
    });
  } catch (err) {
    console.error('Failed to fetch client progress:', err);
    return error('Failed to fetch client progress', 500);
  }
}