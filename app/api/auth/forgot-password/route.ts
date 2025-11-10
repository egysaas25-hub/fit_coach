import { NextRequest, NextResponse } from 'next/server';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';
import { forgotPasswordSchema } from '@/lib/schemas/auth/auth.schema';
import { success, error } from '@/lib/utils/response';
import { database } from '@/lib/mock-db/database';

// In-memory store for password reset tokens
export const resetStore = new Map<string, { email: string; expiresAt: number }>();

const handler = async (req: NextRequest, body: any) => {
  ensureDbInitialized();
  try {
    const { email } = body;

    const user = database.query<any>('users', (u) => u.email === email)[0];
    if (!user) {
      // Do not reveal user existence
      return success({ message: 'If the email exists, a reset link has been sent.' });
    }

    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    resetStore.set(token, { email, expiresAt });

    // Mock email sending (log + notification)
    console.log(`Password reset token for ${email}: ${token}`);
    database.create('notifications', {
      userId: user.id,
      message: `Password reset requested. Token: ${token}`,
      read: false,
    });

    return success({ message: 'If the email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return error('Failed to process request', 500);
  }
};

export const POST = withRateLimit(withValidation(forgotPasswordSchema, handler), 5, 15 * 60 * 1000);
