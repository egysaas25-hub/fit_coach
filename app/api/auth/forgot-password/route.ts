import { NextRequest, NextResponse } from 'next/server';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';
import { forgotPasswordSchema } from '@/lib/schemas/auth/auth.schema';
import { success, error } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const handler = async (req: NextRequest, body: any) => {
  try {
    const { email } = body;

    // Find user by email in team_members table
    const user = await prisma.team_members.findFirst({
      where: { 
        email: email,
        active: true,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        tenant_id: true,
      },
    });

    if (!user) {
      // Do not reveal user existence for security
      return success({ message: 'If the email exists, a reset link has been sent.' });
    }

    // Generate secure reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store reset token in database using audit_log table for now
    // In a production system, you'd want a dedicated password_reset_tokens table
    await prisma.audit_log.create({
      data: {
        tenant_id: user.tenant_id,
        actor_team_member_id: user.id,
        entity: 'password_reset',
        entity_id: user.id,
        action: 'token_created',
        diff: {
          token: token,
          expires_at: expiresAt.toISOString(),
          email: email,
        },
      },
    });

    // Mock email sending (log for development)
    console.log(`Password reset token for ${email}: ${token}`);
    console.log(`Reset link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`);

    // In production, you would send an actual email here
    // await emailService.sendPasswordResetEmail(email, token);

    return success({ message: 'If the email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return error('Failed to process request', 500);
  }
};

export const POST = withRateLimit(withValidation(forgotPasswordSchema, handler), 5, 15 * 60 * 1000);
