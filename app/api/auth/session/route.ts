import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { success } from '@/lib/utils/response';
import { NextResponse } from 'next/server';

import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';

/**
 * Maps user role to user type
 * @param role - The role from the database
 * @returns The corresponding user type
 */
function mapRoleToType(role: string): string {
  switch (role) {
    case 'admin':
    case 'trainer':
      return 'team_member';
    case 'client':
      return 'customer';
    default:
      return 'customer';
  }
}

export const GET = withRateLimit(async (req: NextRequest) => {
  const authResult = await requireAuth(req);

  if (authResult instanceof NextResponse) {
    return authResult; // Return the error response
  }

  const { user } = authResult;
  const { passwordHash, role, ...userWithoutPassword } = user as any;
  
  // Add type field based on role
  const userWithMappedType = {
    ...userWithoutPassword,
    type: mapRoleToType(role),
    role: role // Keep role for token generation
  };
  
  return success({ user: userWithMappedType });
}, 30, 60 * 1000);