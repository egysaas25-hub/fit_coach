import { NextRequest } from 'next/server';
import { database } from '@/lib/mock-db/database';
import { hashPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { registerSchema } from '@/lib/schemas/auth/auth.schema';

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
  ensureDbInitialized();

  try {
    const { email, password, name, role = 'client', phone } = validatedBody;

    // Check if user already exists
    const existingUser = database.query('users', (u: any) => u.email === email)[0];
    if (existingUser) {
      return error('User with this email already exists', 409);
    }

    // Create new user
    const newUser = database.create('users', {
      email,
      name,
      phone,
      role,
      passwordHash: hashPassword(password),
    });

    // If role is client, also create client entry
    if (role === 'client') {
      database.create('clients', {
        ...newUser,
        trainerId: '', // Will be assigned later
      });
    }

    // If role is trainer or admin, create trainer entry
    if (role === 'trainer' || role === 'admin') {
      database.create('trainers', newUser);
    }

    // Generate token
    const token = await generateToken((newUser as any).id, (newUser as any).role);

    // Exclude sensitive data and add type field
    const { passwordHash, role: userRole, ...userWithoutPassword } = newUser as any;
    
    // Add type field based on role
    const userWithMappedType = {
      ...userWithoutPassword,
      type: mapRoleToType(userRole),
      role: userRole // Keep role for token generation
    };

    return success({ user: userWithMappedType, token }, 201);
  } catch (err) {
    console.error('Registration error:', err);
    return error('An unexpected error occurred during registration', 500);
  }
};

export const POST = withValidation(registerSchema, registerHandler);