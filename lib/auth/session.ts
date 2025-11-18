import { NextRequest } from 'next/server'
import { authService, SessionContext } from '@/lib/services/auth'
import { prisma } from '@/lib/prisma'

/**
 * Get session from request headers (set by middleware)
 */
export async function getSession(request: Request | NextRequest): Promise<SessionContext> {
  const headers = request.headers

  const userId = headers.get('x-user-id')
  const tenantId = headers.get('x-tenant-id')
  const role = headers.get('x-user-role')
  const email = headers.get('x-user-email')
  const fullName = headers.get('x-user-name')

  if (!userId || !tenantId || !role) {
    throw new Error('Unauthorized - No session found')
  }

  return {
    user: {
      id: parseInt(userId),
      tenant_id: parseInt(tenantId),
      role,
      email: email || '',
      full_name: fullName || '',
    },
  }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(request: Request | NextRequest): Promise<SessionContext> {
  return await getSession(request)
}

/**
 * Require specific role - throws if user doesn't have required role
 */
export async function requireRole(
  request: Request | NextRequest,
  allowedRoles: string[]
): Promise<SessionContext> {
  const session = await getSession(request)

  if (!allowedRoles.includes(session.user.role)) {
    throw new Error(`Forbidden - Required role: ${allowedRoles.join(' or ')}`)
  }

  return session
}

/**
 * Get session from JWT cookie (for middleware)
 */
export async function getSessionFromCookie(token: string): Promise<SessionContext> {
  const payload = await authService.verifyJWT(token)

  // Fetch full user details
  const user = await prisma.team_members.findUnique({
    where: { id: BigInt(payload.user_id) },
  })

  if (!user || !user.active) {
    throw new Error('User not found or inactive')
  }

  return {
    user: {
      id: payload.user_id,
      tenant_id: payload.tenant_id,
      role: payload.role,
      email: payload.email,
      full_name: user.full_name,
    },
  }
}
