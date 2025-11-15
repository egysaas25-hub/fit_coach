import { NextRequest, NextResponse } from 'next/server';
import { success, error } from '@/lib/utils/response';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';
import { withLogging, logAuthAttempt } from '@/lib/middleware/logging.middleware';
import { otpStore, generateOtp, hashOtp } from '@/lib/auth/otp';
import { sendOTP } from '@/lib/services/whatsapp.service';

async function handler(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Failed to parse JSON body:', parseError);
      return error('Invalid JSON in request body', 400);
    }
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
    otpStore.set(key, { 
      hash: hashOtp(code), 
      expiresAt: now + ttlSeconds * 1000, 
      attempts: 0 
    });

    // Send OTP via WhatsApp (or log in development)
    const fullPhone = `${countryCode}${phone}`;
    await sendOTP(fullPhone, code);

    // 🔥 DEVELOPMENT MODE: Log OTP to console
    if (process.env.NODE_ENV === 'development') {
      console.log('\n==============================================');
      console.log(`📱 OTP for ${countryCode}${phone}: ${code}`);
      console.log(`⏱️  Expires in ${ttlSeconds} seconds`);
      console.log('==============================================\n');
    }

    logAuthAttempt(req, phone, true);
    
    // Return the OTP in response for development ONLY
    return success({ 
      message: 'OTP sent via WhatsApp', 
      ttlSeconds,
      // 🔥 REMOVE THIS IN PRODUCTION
      devMode: process.env.NODE_ENV === 'development' ? { otp: code } : undefined
    });
  } catch (err) {
    console.error('request-otp failed', err);
    try {
      const fallbackBody = await req.json().catch(() => ({} as any));
      logAuthAttempt(req, fallbackBody?.phone || 'unknown', false, 'request-otp failure');
    } catch {}
    return error('Failed to request OTP', 500);
  }
}

export const POST = withLogging(withRateLimit(handler, 3, 5 * 60 * 1000));