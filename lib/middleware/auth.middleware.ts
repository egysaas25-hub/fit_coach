import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { unauthorized, forbidden } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

interface User {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  full_name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends NextRequest {
  user: User;
}

export async function requireAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return unauthorized('Authentication required');
    }

    const payload = verifyToken(token);
    if (!payload) {
      return unauthorized('Invalid or expired token');
    }

    // Get user from real database
    let user: User | null = null;
    
    try {
      const dbUser = await prisma.$queryRaw`
        SELECT 
          member_id as id,
          tenant_id,
          email,
          first_name || ' ' || last_name as name,
          first_name || ' ' || last_name as full_name,
          role,
          created_at,
          updated_at
        FROM team_members
        WHERE member_id = ${payload.userId}::uuid
          AND is_active = true
        LIMIT 1
      `;
      
      if (dbUser && dbUser[0]) {
        user = {
          id: dbUser[0].id,
          tenant_id: dbUser[0].tenant_id,
          email: dbUser[0].email,
          name: dbUser[0].name,
          full_name: dbUser[0].full_name,
          role: dbUser[0].role,
          createdAt: dbUser[0].created_at,
          updatedAt: dbUser[0].updated_at,
        };
      }
    } catch (error) {
      console.error('Database query failed:', error);
      return unauthorized('Database error');
    }

    if (!user) {
      return unauthorized('User not found');
    }

    // Add user to request
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = user;

    return handler(authenticatedRequest);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return unauthorized('Authentication failed');
  }
}

export async function requireRole(
  roles: string[],
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return requireAuth(request, async (req) => {
    if (!roles.includes(req.user.role)) {
      return forbidden('Insufficient permissions');
    }
    return handler(req);
  });
}

export async function requireTenantAccess(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return requireAuth(request, async (req) => {
    const tenantId = request.nextUrl.searchParams.get('tenant_id') || 
                    (await request.json().catch(() => ({})))?.tenant_id;
    
    if (tenantId && req.user.tenant_id !== tenantId) {
      return forbidden('Access denied to this tenant');
    }
    
    return handler(req);
  });
}
