import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { success } from '@/lib/utils/response';
import { NextResponse } from 'next/server';
import { ensureDbInitialized } from '@/lib/db/init';

/**
 * Retrieves the current user's session data.
 * @param req - The Next.js request object.
 * @returns A success response with the user data or an error response.
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);

  if (authResult instanceof NextResponse) {
    return authResult; // Return the error response
  }

  const { user } = authResult;
  // Exclude sensitive data from the response
  const { passwordHash, ...userWithoutPassword } = user;

  return success({ user: userWithoutPassword });
}
