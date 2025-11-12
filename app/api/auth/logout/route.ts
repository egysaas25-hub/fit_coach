import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { success } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { database } from '@/lib/mock-db/database';
import { addToBlacklist } from '@/lib/auth/token-blacklist';

// In-memory blacklist for logged out tokens (in production, use Redis)
const tokenBlacklist = new Set<string>();

export function isBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token);
}

/**
 * POST /api/auth/logout
 * Logout user and invalidate token
 */
export async function POST(req: NextRequest) {
  ensureDbInitialized();

  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    // Get tokens from header and cookies
    const authHeader = req.headers.get('Authorization');
    let bearerToken: string | null = null;
    if (authHeader?.startsWith('Bearer ')) {
      bearerToken = authHeader.split(' ')[1];
    }
    const refreshToken = req.cookies.get('refresh_token')?.value || null;

    if (bearerToken) addToBlacklist(bearerToken);
    if (refreshToken) {
      addToBlacklist(refreshToken);
      // Remove session
      const sessions = database.query<any>('sessions', (s) => s.refreshToken === refreshToken);
      sessions.forEach((s) => database.delete('sessions', s.id));
    }

    const res = NextResponse.json({ success: true, data: { message: 'Logged out successfully' } }, { status: 200 });
    // Clear cookies
    res.cookies.set('access_token', '', { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 0, path: '/' });
    res.cookies.set('refresh_token', '', { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 0, path: '/' });

    return res;
  } catch (err) {
    console.error('Logout error:', err);
    const res = NextResponse.json({ success: true, data: { message: 'Logged out successfully' } }, { status: 200 });
    res.cookies.set('access_token', '', { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 0, path: '/' });
    res.cookies.set('refresh_token', '', { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 0, path: '/' });
    return res; // Always succeed
  }
}