import { NextRequest } from 'next/server';
import { hashPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { success, error } from '@/lib/utils/response';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { apiRegisterSchema as registerSchema } from '@/lib/schemas/auth/auth.schema';
import { prisma } from '@/lib/prisma';

/**
 * Maps user role to user type
 * @param role - The role from the database
 * @returns The corresponding user type
 */
function mapRoleToType(role: string): string {
  switch (role) {
    case 'admin':
    case 'trainer':
      return 'team_member';
    case 'client':
      return 'customer';
    default:
      return 'customer';
  }
}

/**
 * POST /api/auth/register
 * Register a new user
 */
const registerHandler = async (req: NextRequest, validatedBody: any) => {
  console.log('Register API: Received request with body:', validatedBody);
  
  try {
    const { email, password, name, role = 'client', phone } = validatedBody;
    
    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    // Check if user already exists based on role
    if (role === 'client') {
      // For clients, check by phone number
      if (!phone) {
        return error('Phone number is required for client registration', 400);
      }
      
      const existingCustomer = await prisma.customers.findUnique({
        where: {
          uq_customer_phone: {
            tenant_id: tenantId,
            phone_e164: phone
          }
        }
      });
      
      if (existingCustomer) {
        console.log('Register API: Client already exists with phone:', phone);
        return error('Client with this phone number already exists', 409);
      }
    } else {
      // For team members (admin, trainer), check by email
      const existingTeamMember = await prisma.team_members.findUnique({
        where: {
          uq_team_email: {
            tenant_id: tenantId,
            email: email
          }
        }
      });
      
      if (existingTeamMember) {
        console.log('Register API: Team member already exists with email:', email);
        return error('Team member with this email already exists', 409);
      }
    }

    let newUser: any;
    let userRole: string;

    // Create user based on role
    if (role === 'client') {
      // Create customer
      newUser = await prisma.customers.create({
        data: {
          tenant_id: tenantId,
          phone_e164: phone,
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' ') || '',
          source: 'sales',
          status: 'lead',
        }
      });
      
      userRole = 'client';
      console.log('Register API: Created new customer:', newUser);
    } else {
      // Map 'trainer' role to 'coach' role in database
      const dbRole = role === 'trainer' ? 'coach' : role;
      
      // Create team member
      newUser = await prisma.team_members.create({
        data: {
          tenant_id: tenantId,
          full_name: name,
          email: email,
          role: dbRole,
        }
      });
      
      userRole = role;
      console.log('Register API: Created new team member:', newUser);
    }

    // Generate token
    const token = await generateToken(newUser.id.toString(), userRole);
    console.log('Register API: Generated token');

    // Prepare response user object
    let userResponse: any;
    
    if (role === 'client') {
      userResponse = {
        id: newUser.id.toString(),
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        phone: newUser.phone_e164,
        role: userRole,
        type: mapRoleToType(userRole)
      };
    } else {
      userResponse = {
        id: newUser.id.toString(),
        fullName: newUser.full_name,
        email: newUser.email,
        role: userRole,
        type: mapRoleToType(userRole)
      };
    }

    console.log('Register API: Returning success response');
    return success({ user: userResponse, token }, 201);
  } catch (err) {
    console.error('Registration error:', err);
    return error('An unexpected error occurred during registration', 500);
  }
};

export { registerHandler };

export const POST = withValidation(registerSchema, registerHandler);