import { NextRequest } from 'next/server';
import { hashPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { apiRegisterSchema as registerSchema } from '@/lib/schemas/auth/auth.schema';

// Temporary workaround for database import issue
const createMockDatabase = () => {
  const users: any[] = [];
  
  return {
    query: (table: string, predicate: (item: any) => boolean) => {
      if (table === 'users') {
        return users.filter(predicate);
      }
      return [];
    },
    create: (table: string, data: any) => {
      const now = new Date();
      const newItem = {
        id: Math.random().toString(36).substring(2, 15),
        createdAt: now,
        updatedAt: now,
        ...data,
      };
      
      if (table === 'users') {
        users.push(newItem);
      }
      
      return newItem;
    }
  };
};

const database = createMockDatabase();

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
  // Comment out database initialization due to import issues
  // ensureDbInitialized();

  try {
    const { email, password, name, role = 'client', phone } = validatedBody;

    // Check if user already exists
    const existingUser = database.query('users', (u: any) => u.email === email)[0];
    if (existingUser) {
      console.log('Register API: User already exists with email:', email);
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
    console.log('Register API: Created new user:', newUser);

    // If role is client, also create client entry
    if (role === 'client') {
      database.create('clients', {
        ...newUser,
        trainerId: '', // Will be assigned later
      });
      console.log('Register API: Created client entry');
    }

    // If role is trainer or admin, create trainer entry
    if (role === 'trainer' || role === 'admin') {
      database.create('trainers', newUser);
      console.log('Register API: Created trainer entry');
    }

    // Generate token
    const token = await generateToken((newUser as any).id, (newUser as any).role);
    console.log('Register API: Generated token');

    // Exclude sensitive data and add type field
    const { passwordHash, role: userRole, ...userWithoutPassword } = newUser as any;
    
    // Add type field based on role
    const userWithMappedType = {
      ...userWithoutPassword,
      type: mapRoleToType(userRole),
      role: userRole // Keep role for token generation
    };

    console.log('Register API: Returning success response');
    return success({ user: userWithMappedType, token }, 201);
  } catch (err) {
    console.error('Registration error:', err);
    return error('An unexpected error occurred during registration', 500);
  }
};

export const POST = withValidation(registerSchema, registerHandler);