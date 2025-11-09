import { NextRequest, NextResponse } from 'next/server';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { database } from '@/lib/mock-db/database';
import { generateToken } from '@/lib/auth/jwt';
import { withLogging, logAuthAttempt } from '@/lib/middleware/logging.middleware';

// Use same store as request-otp (module-level for simplicity)
const otpStore = new Map<string, { hash: string; expiresAt: number; attempts: number; lockedUntil?: number }>();

function hashOtp(code: string): string {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash << 5) - hash + code.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

export const POST = withLogging(async (req: NextRequest) => {
  ensureDbInitialized();
  try {
    const body = await req.json();
    const { phone, countryCode, code, role = 'client' } = body || {};
    if (!phone || !countryCode || !code) {
      logAuthAttempt(req, phone || 'unknown', false, 'missing fields');
      return error('phone, countryCode and code are required', 400);
    }

    const key = `${countryCode}:${phone}`;
    const entry = otpStore.get(key);
    const now = Date.now();
    if (!entry) {
      logAuthAttempt(req, phone, false, 'no otp');
      database.create('authAttempts', { phone, countryCode, success: false, reason: 'no otp' });
      return error('No OTP requested for this number', 400);
    }
    if (entry.lockedUntil && entry.lockedUntil > now) {
      logAuthAttempt(req, phone, false, 'locked');
      database.create('authAttempts', { phone, countryCode, success: false, reason: 'locked' });
      return error('Too many attempts. Try again later.', 429);
    }
    if (entry.expiresAt < now) {
      logAuthAttempt(req, phone, false, 'expired');
      database.create('authAttempts', { phone, countryCode, success: false, reason: 'expired' });
      return error('OTP expired', 400);
    }

    const valid = entry.hash === hashOtp(code);
    entry.attempts += 1;

    if (!valid) {
      // Lockout after 5 failed attempts for 5 minutes
      if (entry.attempts >= 5) {
        entry.lockedUntil = now + 5 * 60 * 1000;
      }
      otpStore.set(key, entry);
      logAuthAttempt(req, phone, false, 'invalid code');
      database.create('authAttempts', { phone, countryCode, success: false, reason: 'invalid code' });
      return error('Invalid OTP code', 401);
    }

    // OTP valid: create or fetch user
    const email = `${phone.replace(/\D/g, '')}@example.com`;
    const name = `User ${phone}`;
    let user = database.query<any>('users', (u) => u.email === email)[0];
    if (!user) {
      user = database.create<any>('users', {
        email,
        name,
        role,
        passwordHash: '',
      });
    }

    const token = await generateToken(user.id, role);

    // Map to expected DTO format
    const userDto = {
      id: user.id,
      tenant_id: 'tenant-1',
      type: role,
      email: user.email,
      name: user.name,
    };

    logAuthAttempt(req, email, true);
    database.create('authAttempts', { phone, countryCode, success: true });
    return success({ token, user: userDto });
  } catch (err) {
    console.error('verify-otp failed', err);
    try {
      const body = await req.json().catch(() => ({} as any));
      logAuthAttempt(req, body?.phone || 'unknown', false, 'verify-otp failure');
      database.create('authAttempts', { phone: (body?.phone || 'unknown'), countryCode: (body?.countryCode || 'unknown'), success: false, reason: 'verify-otp failure' });
    } catch {}
    return error('Failed to verify OTP', 500);
  }
});
