import { NextRequest } from 'next/server';
import { database } from '@/lib/mock-db/database';
import { comparePassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { success, unauthorized, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

/**
 * Handles user login.
 * @param req - The Next.js request object.
 * @returns A success response with a JWT token or an error response.
 */
export async function POST(req: NextRequest) {
  ensureDbInitialized();
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return unauthorized('Email and password are required.');
    }

    const user = database.query('users', (u) => u.email === email)[0];

    if (!user) {
      return unauthorized('Invalid credentials.');
    }

    // Use the mock password comparison function with the user's stored hash
    const isPasswordValid = comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
        return unauthorized('Invalid credentials.');
    }

    const token = await generateToken(user.id, user.role);

    // Exclude sensitive data from the response
    const { passwordHash, ...userWithoutPassword } = user;

    return success({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Login error:', err);
    return error('An unexpected error occurred during login.', 500);
  }
}
