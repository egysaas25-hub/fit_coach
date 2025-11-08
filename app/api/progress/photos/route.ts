import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { database, ProgressEntry } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

/**
 * GET /api/progress/photos
 * Get progress photos
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let entries = database.query<ProgressEntry>(
      'progressEntries',
      (e) => e.metric === 'photo'
    );

    // Filter by client
    if (user.role === 'client') {
      entries = entries.filter((e) => e.clientId === user.id);
    } else if (clientId) {
      entries = entries.filter((e) => e.clientId === clientId);
    } else {
      return error('clientId parameter is required', 400);
    }

    // Sort by date (newest first)
    entries = database.sort(entries, 'date', 'desc');
    entries = entries.slice(0, limit);

    return success(entries);
  } catch (err) {
    console.error('Failed to fetch photos:', err);
    return error('Failed to fetch photos', 500);
  }
}

/**
 * POST /api/progress/photos
 * Upload progress photo (base64 encoded)
 */
export async function POST(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const body = await req.json();
    const { clientId, photoData, type, date, notes } = body;

    if (!photoData) {
      return error('Photo data is required', 400);
    }

    // Validate base64 format (basic check)
    if (!photoData.startsWith('data:image/')) {
      return error('Invalid photo format. Must be base64 encoded image', 400);
    }

    // Check size (5MB limit)
    const sizeInBytes = (photoData.length * 3) / 4;
    if (sizeInBytes > 5 * 1024 * 1024) {
      return error('Photo size must be less than 5MB', 400);
    }

    let finalClientId = clientId;
    if (user.role === 'client') {
      finalClientId = user.id;
    } else if (!clientId) {
      return error('clientId is required', 400);
    }

    // Generate mock URL (in production, upload to S3/CloudStorage)
    const mockUrl = `https://storage.example.com/progress/${finalClientId}/${Date.now()}.jpg`;

    const newEntry = database.create<ProgressEntry>('progressEntries', {
      clientId: finalClientId,
      metric: 'photo',
      value: {
        url: mockUrl,
        type: type || 'front', // front, side, back
        thumbnailUrl: mockUrl,
      },
      date: date ? new Date(date) : new Date(),
      notes,
    });

    return success(newEntry, 201);
  } catch (err) {
    console.error('Failed to upload photo:', err);
    return error('Failed to upload photo', 500);
  }
}