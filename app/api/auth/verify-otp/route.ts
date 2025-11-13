import { NextRequest, NextResponse } from 'next/server';
import { success, error } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth/jwt';
import { withLogging, logAuthAttempt } from '@/lib/middleware/logging.middleware';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';

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
      // Registration flow
      if (role === 'admin' || role === 'team_member') {
        // Create team member
        user = await prisma.team_members.create({
          data: {
            tenant_id: BigInt(1), // Default tenant
            full_name: name,
            email: email || `${phone.replace(/\D/g, '')}@example.com`,
            role: 'admin', // Default to admin for team members
            wa_user_id: fullPhone,
          },
        });
        userType = 'team_member';
        userEmail = user.email;
        userName = user.full_name;
      } else {
        // Create customer
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
      // Login flow - find existing user
      const customer = await prisma.customers.findUnique({
        where: {
          uq_customer_phone: {
            tenant_id: BigInt(1),
            phone_e164: fullPhone,
          },
        },
      });

      const teamMember = await prisma.team_members.findUnique({
        where: {
          uq_team_email: {
            tenant_id: BigInt(1),
            email: `${phone.replace(/\D/g, '')}@example.com`,
          },
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
    return success({ token, user: userDto });
  } catch (err) {
    console.error('verify-otp failed', err);
    try {
      const body = await req.json().catch(() => ({} as any));
      logAuthAttempt(req, body?.phone || 'unknown', false, 'verify-otp failure');
    } catch {}
    return error('Failed to verify OTP', 500);
  }
}), 5, 5 * 60 * 1000);