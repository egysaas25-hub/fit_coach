import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { success } from '@/lib/utils/response';
import { NextResponse } from 'next/server';
import { ensureDbInitialized } from '@/lib/db/init';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';

export const GET = withRateLimit(async (req: NextRequest) => {
  ensureDbInitialized();
  const authResult = await requireAuth(req);

  if (authResult instanceof NextResponse) {
    return authResult; // Return the error response
  }

  const { user } = authResult;
  const { passwordHash, ...userWithoutPassword } = user;
  return success({ user: userWithoutPassword });
}, 30, 60 * 1000);