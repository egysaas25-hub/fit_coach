import { NextRequest } from 'next/server';
import { authService } from '@/lib/services/auth';
import { success, unauthorized, error } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return unauthorized('Refresh token is required');
    }

    // Verify refresh token using auth service
    const payload = await authService.verifyJWT(refreshToken);
    if (!payload) {
      return unauthorized('Invalid or expired refresh token');
    }

    // Check if user still exists in database
    const teamMember = await prisma.team_members.findUnique({
      where: { id: BigInt(payload.user_id) },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        tenant_id: true,
        active: true,
      },
    });

    if (!teamMember || !teamMember.active) {
      return unauthorized('User not found or inactive');
    }

    // Generate new access token
    const newToken = await authService.signJWT({
      user_id: Number(teamMember.id),
      tenant_id: Number(teamMember.tenant_id),
      role: teamMember.role,
      email: teamMember.email,
    });

    return success({ 
      token: newToken,
      user: {
        id: teamMember.id.toString(),
        name: teamMember.full_name,
        email: teamMember.email,
        role: teamMember.role,
        tenant_id: teamMember.tenant_id.toString(),
      }
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    return error('An unexpected error occurred', 500);
  }
}