import { NextRequest } from 'next/server';
import { verifyToken, generateToken } from '@/lib/auth/jwt';
import { database } from '@/lib/mock-db/database';
import { success, unauthorized, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { isBlacklisted } from '@/app/api/auth/logout/route';

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
export async function POST(req: NextRequest) {
  ensureDbInitialized();

  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return unauthorized('Refresh token is required');
    }

    // Check if token is blacklisted
    if (isBlacklisted(refreshToken)) {
      return unauthorized('Token has been invalidated');
    }

    // Verify refresh token
    const payload = await verifyToken(refreshToken);
    if (!payload) {
      return unauthorized('Invalid or expired refresh token');
    }

    // Check if user still exists
    const user = database.get('users', payload.userId);
    if (!user) {
      return unauthorized('User not found');
    }

    // Generate new access token
    const newToken = await generateToken((user as any).id, (user as any).role);

    return success({ token: newToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    return error('An unexpected error occurred', 500);
  }
}