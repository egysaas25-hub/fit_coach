import { NextRequest, NextResponse } from 'next/server';
import { success, error } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth/jwt';
import { withLogging, logAuthAttempt } from '@/lib/middleware/logging.middleware';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';
import { otpStore, hashOtp } from '@/lib/auth/otp';

export const POST = withRateLimit(withLogging(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { phone, countryCode, code, role = 'client', name, email, workspaceName } = body || {};
    if (!phone || !countryCode || !code) {
      logAuthAttempt(req, phone || 'unknown', false, 'missing fields');
      return error('phone, countryCode and code are required', 400);
    }

    const key = `${countryCode}:${phone}`;
    const entry = otpStore.get(key);
    const now = Date.now();
    if (!entry) {
      logAuthAttempt(req, phone, false, 'no otp');
      return error('No OTP requested for this number', 400);
    }
    if (entry.lockedUntil && entry.lockedUntil > now) {
      logAuthAttempt(req, phone, false, 'locked');
      return error('Too many attempts. Try again later.', 429);
    }
    if (entry.expiresAt < now) {
      logAuthAttempt(req, phone, false, 'expired');
      return error('OTP expired', 400);
    }

    const valid = entry.hash === hashOtp(code);
    entry.attempts += 1;

    if (!valid) {
      // Lockout after 3 failed attempts for 5 minutes
      if (entry.attempts >= 3) {
        entry.lockedUntil = now + 5 * 60 * 1000;
      }
      otpStore.set(key, entry);
      logAuthAttempt(req, phone, false, 'invalid code');
      return error('Invalid OTP code', 401);
    }

    // OTP valid: create or fetch user
    const fullPhone = `${countryCode}${phone}`;
    
    // Check if this is a registration request (has name/workspaceName)
    let user;
    let userType;
    let userEmail;
    let userName;
    
    if (name && workspaceName) {
      // REGISTRATION - create new user
      if (role === 'admin' || role === 'team_member') {
        user = await prisma.team_members.create({
          data: {
            tenant_id: BigInt(1),
            full_name: name,
            email: email || `${phone.replace(/\D/g, '')}@temp.example.com`,
            role: 'admin',
            wa_user_id: fullPhone,
          },
        });
        userType = 'team_member';
        userEmail = user.email;
        userName = user.full_name;
      } else {
        // Create customer...
        user = await prisma.customers.create({
          data: {
            tenant_id: BigInt(1), // Default tenant
            phone_e164: fullPhone,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ') || 'User',
            source: 'sales',
            status: 'lead',
          },
        });
        userType = 'customer';
        userEmail = null;
        userName = `${user.first_name} ${user.last_name}`;
      }
    } else {
      // LOGIN - find existing user by phone
      const customer = await prisma.customers.findFirst({
        where: {
          tenant_id: BigInt(1),
          phone_e164: fullPhone,
        },
      });

      const teamMember = await prisma.team_members.findFirst({
        where: {
          tenant_id: BigInt(1),
          wa_user_id: fullPhone, // Use wa_user_id, not fake email
        },
      });

      if (customer) {
        user = customer;
        userType = 'customer';
        userEmail = null;
        userName = `${customer.first_name} ${customer.last_name}`;
      } else if (teamMember) {
        user = teamMember;
        userType = 'team_member';
        userEmail = teamMember.email;
        userName = teamMember.full_name;
      } else {
        logAuthAttempt(req, phone, false, 'user not found');
        return error('User not found', 404);
      }
    }

    const token = await generateToken(String(user.id), role);

    // Map to expected DTO format
    const userDto = {
      id: String(user.id),
      tenant_id: String(user.tenant_id),
      type: userType,
      email: userEmail,
      name: userName,
    };

    logAuthAttempt(req, phone, true);
    
    // Set HttpOnly cookies for better security
    const response = NextResponse.json(
      { success: true, data: { token, user: userDto } },
      { status: 200 }
    );
    
    // Set HttpOnly cookies
    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    });
    
    return response;
  } catch (err) {
    console.error('verify-otp failed', err);
    try {
      const body = await req.json().catch(() => ({} as any));
      logAuthAttempt(req, body?.phone || 'unknown', false, 'verify-otp failure');
    } catch {}
    return error('Failed to verify OTP', 500);
  }
}), 5, 5 * 60 * 1000);