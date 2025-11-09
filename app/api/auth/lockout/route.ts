import { NextRequest } from 'next/server';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

// Share the same store for simplicity
const otpStore = new Map<string, { hash: string; expiresAt: number; attempts: number; lockedUntil?: number }>();

export async function PATCH(req: NextRequest) {
  ensureDbInitialized();
  try {
    const body = await req.json();
    const { phone, countryCode, minutes = 15 } = body || {};
    if (!phone || !countryCode) {
      return error('phone and countryCode are required', 400);
    }
    const key = `${countryCode}:${phone}`;
    const entry = otpStore.get(key) || { hash: '', expiresAt: 0, attempts: 0 };
    entry.lockedUntil = Date.now() + minutes * 60 * 1000;
    otpStore.set(key, entry);
    return success({ message: 'Lockout applied', until: entry.lockedUntil });
  } catch (err) {
    console.error('lockout failed', err);
    return error('Failed to apply lockout', 500);
  }
}
