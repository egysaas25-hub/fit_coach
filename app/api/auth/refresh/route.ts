import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateToken } from '@/lib/auth/jwt';
import { database } from '@/lib/mock-db/database';
import { success, unauthorized, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { isBlacklisted } from '@/app/api/auth/logout/route';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';

async function handler(req: NextRequest) {
  ensureDbInitialized();

  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return unauthorized('Refresh token cookie is required');
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

    // Check if session exists and not expired
    const session = database.query<any>('sessions', (s) => s.refreshToken === refreshToken)[0];
    if (!session || new Date(session.expiresAt).getTime() < Date.now()) {
      return unauthorized('Session expired');
    }

    // Check if user still exists
    const user = database.get<any>('users', payload.userId);
    if (!user) {
      return unauthorized('User not found');
    }

    // Generate new access token (15 min)
    const newToken = await generateToken(user.id, user.role, 15 * 60 * 1000);

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set('access_token', newToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 15 * 60,
      path: '/',
    });
    return res;
  } catch (err) {
    console.error('Refresh token error:', err);
    return error('An unexpected error occurred', 500);
  }
}

export const POST = withRateLimit(handler, 10, 5 * 60 * 1000);