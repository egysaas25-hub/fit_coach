import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/progress/photos
 * Get progress photos
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const { user } = session;

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let finalClientId: bigint;
    if (user.role === 'client') {
      finalClientId = BigInt(user.id);
    } else if (clientId) {
      finalClientId = BigInt(clientId);
    } else {
      return error('clientId parameter is required', 400);
    }

    // Get progress photos from media_references table
    const photos = await prisma.media_references.findMany({
      where: {
        tenant_id: BigInt(user.tenant_id),
        entity_type: 'progress_photo',
        entity_id: finalClientId,
        type: 'image',
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    // Transform to expected format
    const entries = photos.map(photo => ({
      id: photo.id.toString(),
      clientId: photo.entity_id.toString(),
      metric: 'photo',
      value: {
        url: photo.url,
        type: 'front', // Default type, could be stored in metadata
        thumbnailUrl: photo.url, // Same URL for now
      },
      date: photo.created_at,
      notes: null, // Could be added to media_references table
    }));

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
  try {
    const session = await getSession(req);
    const { user } = session;

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

    let finalClientId: bigint;
    if (user.role === 'client') {
      finalClientId = BigInt(user.id);
    } else if (!clientId) {
      return error('clientId is required', 400);
    } else {
      finalClientId = BigInt(clientId);
    }

    // Generate mock URL (in production, upload to S3/CloudStorage)
    const mockUrl = `https://storage.example.com/progress/${finalClientId}/${Date.now()}.jpg`;

    // Store photo reference in media_references table
    const newPhoto = await prisma.media_references.create({
      data: {
        tenant_id: BigInt(user.tenant_id),
        entity_type: 'progress_photo',
        entity_id: finalClientId,
        url: mockUrl,
        type: 'image',
      },
    });

    // Transform to expected format
    const response = {
      id: newPhoto.id.toString(),
      clientId: newPhoto.entity_id.toString(),
      metric: 'photo',
      value: {
        url: newPhoto.url,
        type: type || 'front', // front, side, back
        thumbnailUrl: newPhoto.url,
      },
      date: newPhoto.created_at,
      notes: notes,
    };

    return success(response, 201);
  } catch (err) {
    console.error('Failed to upload photo:', err);
    return error('Failed to upload photo', 500);
  }
}