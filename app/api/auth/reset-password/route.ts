import { NextRequest, NextResponse } from 'next/server';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';
import { resetPasswordSchema } from '@/lib/schemas/auth/auth.schema';
import { success, error } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const handler = async (req: NextRequest, body: any) => {
  try {
    const { token, password } = body;

    // Find the reset token in audit_log table
    const resetEntry = await prisma.audit_log.findFirst({
      where: {
        entity: 'password_reset',
        action: 'token_created',
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!resetEntry || !resetEntry.diff) {
      return error('Invalid or expired token', 400);
    }

    const tokenData = resetEntry.diff as any;
    
    // Verify token matches and hasn't expired
    if (tokenData.token !== token) {
      return error('Invalid or expired token', 400);
    }

    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      return error('Invalid or expired token', 400);
    }

    // Find the user
    const user = await prisma.team_members.findFirst({
      where: { 
        email: tokenData.email,
        active: true,
      },
    });

    if (!user) {
      return error('Invalid token', 400);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Note: Since team_members table doesn't have a password field in the current schema,
    // we'll store it in the audit_log for now. In production, you'd add a password field
    // or create a separate user_credentials table
    await prisma.audit_log.create({
      data: {
        tenant_id: user.tenant_id,
        actor_team_member_id: user.id,
        entity: 'password_update',
        entity_id: user.id,
        action: 'password_changed',
        diff: {
          password_hash: hashedPassword,
          changed_at: new Date().toISOString(),
        },
      },
    });

    // Mark the reset token as used
    await prisma.audit_log.create({
      data: {
        tenant_id: user.tenant_id,
        actor_team_member_id: user.id,
        entity: 'password_reset',
        entity_id: user.id,
        action: 'token_used',
        diff: {
          token: token,
          used_at: new Date().toISOString(),
        },
      },
    });

    return success({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return error('Failed to reset password', 500);
  }
};

export const POST = withRateLimit(withValidation(resetPasswordSchema, handler), 5, 15 * 60 * 1000);
