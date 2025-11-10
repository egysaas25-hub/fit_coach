import { NextRequest, NextResponse } from 'next/server';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';
import { resetPasswordSchema } from '@/lib/schemas/auth/auth.schema';
import { success, error } from '@/lib/utils/response';
import { database } from '@/lib/mock-db/database';
import { hashPassword } from '@/lib/auth/password';

// Import the reset store from forgot-password route
import * as Forgot from '@/app/api/auth/forgot-password/route';

const handler = async (req: NextRequest, body: any) => {
  ensureDbInitialized();
  try {
    const { token, password } = body;

    // Access the reset store via import (module-level singleton)
    // @ts-ignore
    const resetStore = Forgot.resetStore as Map<string, { email: string; expiresAt: number }>;
    if (!resetStore || !resetStore.has(token)) {
      return error('Invalid or expired token', 400);
    }

    const entry = resetStore.get(token)!;
    if (entry.expiresAt < Date.now()) {
      resetStore.delete(token);
      return error('Invalid or expired token', 400);
    }

    const user = database.query<any>('users', (u) => u.email === entry.email)[0];
    if (!user) {
      resetStore.delete(token);
      return error('Invalid token', 400);
    }

    // Update password
    database.update<any>('users', user.id, { passwordHash: hashPassword(password) });

    // Invalidate existing sessions
    const sessions = database.query<any>('sessions', (s) => s.userId === user.id);
    sessions.forEach((s) => database.delete('sessions', s.id));

    resetStore.delete(token);

    return success({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return error('Failed to reset password', 500);
  }
};

export const POST = withRateLimit(withValidation(resetPasswordSchema, handler), 5, 15 * 60 * 1000);
