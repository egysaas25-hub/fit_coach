import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { success } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

// In-memory blacklist for logged out tokens (in production, use Redis)
const tokenBlacklist = new Set<string>();

export function addToBlacklist(token: string) {
  tokenBlacklist.add(token);
}

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
    // Get token from header
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      // Add token to blacklist
      addToBlacklist(token);
    }

    return success({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return success({ message: 'Logged out successfully' }); // Always succeed
  }
}