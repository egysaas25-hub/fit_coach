import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/mock-db/database';
import { comparePassword } from '@/lib/auth/password';
import { generateToken, generateRefreshToken } from '@/lib/auth/jwt';
import { unauthorized, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { loginSchema } from '@/lib/schemas/auth/auth.schema';

/**
 * Handles user login with HTTP-only cookie session creation.
 */
const handler = async (req: NextRequest) => {
  ensureDbInitialized();
  try {
    const { email, password } = await req.json();

    const user = database.query<any>('users', (u) => u.email === email)[0];
    if (!user) return unauthorized('Invalid credentials.');

    const isPasswordValid = comparePassword(password, user.passwordHash);
    if (!isPasswordValid) return unauthorized('Invalid credentials.');

    const accessToken = await generateToken(user.id, user.role, 15 * 60 * 1000);
    const refreshToken = await generateRefreshToken(user.id, user.role, 7 * 24 * 60 * 60 * 1000);

    // Persist session
    database.create('sessions', {
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const { passwordHash, ...userWithoutPassword } = user as any;

    const res = NextResponse.json({ success: true, data: { user: userWithoutPassword } }, { status: 200 });
    res.cookies.set('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });
    res.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('Login error:', err);
    return error('An unexpected error occurred during login.', 500);
  }
};

// Apply validation and rate limiting: max 5 attempts per 15 minutes
export const POST = withRateLimit(withValidation(loginSchema, handler), 5, 15 * 60 * 1000);