import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { database } from '@/lib/mock-db/database';
import type { User } from '@/lib/mock-db/database';
import { unauthorized, forbidden } from '@/lib/utils/response';

type Role = 'client' | 'trainer' | 'admin' | 'super-admin';

/**
 * Checks for a valid JWT in the Authorization header and returns the user if successful.
 * If the token is missing, invalid, or the user doesn't exist, it returns an unauthorized response.
 *
 * @param req - The Next.js request object.
 * @returns An object containing the user or a NextResponse with an error.
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ user: User } | NextResponse> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized('Authorization header is missing or invalid.');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return unauthorized('Token is missing.');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return unauthorized('Invalid or expired token.');
  }

  const user = database.get<User>('users', payload.userId);
  if (!user) {
    return unauthorized('User not found.');
  }

  return { user };
}

/**
 * Checks if the user has one of the required roles.
 * This function should be called after `requireAuth`.
 *
 * @param user - The user object, typically from `requireAuth`.
 * @param roles - An array of roles that are allowed.
 * @returns A forbidden response if the user's role is not allowed, otherwise null.
 */
export function requireRole(user: User, roles: Role[]): NextResponse | null {
  if (!roles.includes(user.role as Role)) {
    return forbidden('You do not have permission to access this resource.');
  }
  return null;
}
