import { NextRequest } from 'next/server';
import { database } from '@/lib/mock-db/database';
import { hashPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { withValidation } from '@/lib/middleware/validate.middleware';
import { registerSchema } from '@/lib/schemas/auth/auth.schema';
import { withRateLimit } from '@/lib/middleware/rate-limit.middleware';

/**
 * POST /api/auth/register
 * Register a new user
 */
const registerHandler = async (req: NextRequest, validatedBody: any) => {
  ensureDbInitialized();

  try {
    const { email, password, name, role = 'client' } = validatedBody;

    // Check if user already exists
    const existingUser = database.query('users', (u: any) => u.email === email)[0];
    if (existingUser) {
      return error('User with this email already exists', 409);
    }

    // Create new user
    const newUser = database.create('users', {
      email,
      name,
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

    // If role is trainer, create trainer entry
    if (role === 'trainer') {
      database.create('trainers', newUser);
    }

    const created = newUser as any;
    const token = await generateToken(created.id, created.role);

    // Exclude sensitive data
    const { passwordHash, ...userResponse } = created;

    return success({ user: userResponse, token }, 201);
  } catch (err) {
    console.error('Registration error:', err);
    return error('An unexpected error occurred during registration', 500);
  }
};

export const POST = withRateLimit(withValidation(registerSchema, registerHandler), 5, 15 * 60 * 1000);