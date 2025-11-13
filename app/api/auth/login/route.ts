import { NextRequest } from 'next/server';
import { comparePassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { success, unauthorized, error } from '@/lib/utils/response';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';
import { prisma } from '@/lib/prisma';

/**
 * Maps user role to user type
 * @param role - The role from the database
 * @returns The corresponding user type
 */
function mapRoleToType(role: string): string {
  switch (role) {
    case 'admin':
    case 'coach': // Map 'coach' role from database to 'trainer' type
      return 'team_member';
    case 'client':
      return 'customer';
    default:
      return 'customer';
  }
}

/**
 * Handles user login.
 * @param req - The Next.js request object.
 * @returns A success response with a JWT token or an error response.
 */
async function loginHandler(req: NextRequest) {
  try {
    const { email, password, bypassValidation } = await req.json();

    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    // Temporary bypass for development
    if (bypassValidation) {
      // First check if user exists in team_members
      let user = await prisma.team_members.findUnique({
        where: {
          uq_team_email: {
            tenant_id: tenantId,
            email: email
          }
        }
      });

      let userType = 'team_member';
      let userRole = '';

      if (!user) {
        // If not found in team_members, check customers
        const customer = await prisma.customers.findUnique({
          where: {
            uq_customer_phone: {
              tenant_id: tenantId,
              phone_e164: email // For bypass, we're using email as phone for clients
            }
          }
        });

        if (!customer) {
          return unauthorized('Invalid credentials.');
        }

        // Prepare customer response
        userRole = 'client';
        const token = await generateToken(customer.id.toString(), userRole);
        
        const customerResponse = {
          id: customer.id.toString(),
          firstName: customer.first_name || '',
          lastName: customer.last_name || '',
          phone: customer.phone_e164,
          role: userRole,
          type: 'customer'
        };

        return success({ user: customerResponse, token });
      } else {
        // Map database role to user type
        userRole = user.role === 'coach' ? 'trainer' : user.role;
        const token = await generateToken(user.id.toString(), userRole);
        
        // Prepare team member response
        const teamMemberResponse = {
          id: user.id.toString(),
          fullName: user.full_name,
          email: user.email,
          role: userRole,
          type: 'team_member'
        };

        return success({ user: teamMemberResponse, token });
      }
    }

    if (!email || !password) {
      return unauthorized('Email and password are required.');
    }

    // First check if user exists in team_members
    let user = await prisma.team_members.findUnique({
      where: {
        uq_team_email: {
          tenant_id: tenantId,
          email: email
        }
      }
    });

    let userType = 'team_member';
    let userRole = '';
    let passwordHash = '';

    if (!user) {
      // If not found in team_members, check customers
      // For customers, we would need to implement a different authentication method
      // Since customers don't have passwords in the current schema, we'll return unauthorized
      return unauthorized('Invalid credentials.');
    } else {
      // Team members have roles in the database
      userRole = user.role === 'coach' ? 'trainer' : user.role;
      // For this implementation, we're not storing password hashes for team members yet
      // In a real implementation, you would add a password_hash field to the team_members table
      passwordHash = `mock-hashed-password`; // Placeholder
    }

    // Use the mock password comparison function with the user's stored hash
    const isPasswordValid = comparePassword(password, passwordHash);

    if (!isPasswordValid) {
      return unauthorized('Invalid credentials.');
    }

    const token = await generateToken(user.id.toString(), userRole);

    // Prepare user response
    const userResponse = {
      id: user.id.toString(),
      fullName: user.full_name,
      email: user.email,
      role: userRole,
      type: 'team_member'
    };

    return success({ user: userResponse, token });
  } catch (err) {
    console.error('Login error:', err);
    return error('An unexpected error occurred during login.', 500);
  }
}

export { loginHandler };

// Apply rate limiting: max 5 attempts per 15 minutes
export const POST = withRateLimit(loginHandler, 5, 15 * 60 * 1000);
