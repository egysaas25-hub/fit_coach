import { NextRequest, NextResponse } from 'next/server';
import { success, error } from '@/lib/utils/response';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';
import { withLogging, logAuthAttempt } from '@/lib/middleware/logging.middleware';
import { ensureDbInitialized } from '@/lib/db/init';
import { database } from '@/lib/mock-db/database';

// In-memory store for OTPs (simulate Respond.io send + tracking)
const otpStore = new Map<string, { hash: string; expiresAt: number; attempts: number; lockedUntil?: number }>();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOtp(code: string): string {
  // Simple hash for mock (do NOT use in production)
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash << 5) - hash + code.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

async function handler(req: NextRequest) {
  ensureDbInitialized();
  try {
    const body = await req.json();
    const { phone, countryCode } = body || {};
    if (!phone || !countryCode) {
      return error('phone and countryCode are required', 400);
    }

    const key = `${countryCode}:${phone}`;
    const existing = otpStore.get(key);
    const now = Date.now();
    if (existing?.lockedUntil && existing.lockedUntil > now) {
      logAuthAttempt(req, phone, false, 'locked');
      return error('Too many attempts. Try again later.', 429);
    }

    const code = generateOtp();
    const ttlSeconds = 120;
    otpStore.set(key, { hash: hashOtp(code), expiresAt: now + ttlSeconds * 1000, attempts: 0 });

    // Simulate sending via Respond.io (omitted)
    logAuthAttempt(req, phone, true);
    database.create('authAttempts', { phone, countryCode, success: true });
    return success({ message: 'OTP sent via WhatsApp', ttlSeconds });
  } catch (err) {
    console.error('request-otp failed', err);
    try {
      const fallbackBody = await req.json().catch(() => ({} as any));
      logAuthAttempt(req, fallbackBody?.phone || 'unknown', false, 'request-otp failure');
      database.create('authAttempts', { phone: (fallbackBody?.phone || 'unknown'), countryCode: (fallbackBody?.countryCode || 'unknown'), success: false, reason: 'request-otp failure' });
    } catch {}
    return error('Failed to request OTP', 500);
  }
}

export const POST = withLogging(withRateLimit(handler, 3, 5 * 60 * 1000));
