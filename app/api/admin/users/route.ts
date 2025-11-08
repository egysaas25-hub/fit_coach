import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, User } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { hashPassword } from '@/lib/auth/password';

/**
 * GET /api/admin/users
 * Get all users (Admin only)
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let users = database.getAll<User>('users');

    // Filter by role
    if (role) {
      users = users.filter((u) => u.role === role);
    }

    // Search
    if (search) {
      users = database.search('users', search, ['name', 'email']);
    }

    // Sort by creation date (newest first)
    users = database.sort(users, 'createdAt', 'desc');

    // Paginate
    const result = database.paginate(users, page, limit);

    // Remove sensitive data
    const sanitized = result.data.map(({ passwordHash, ...u }) => u);

    return success({ data: sanitized, pagination: result.pagination });
  } catch (err) {
    console.error('Failed to fetch users:', err);
    return error('Failed to fetch users', 500);
  }
}

/**
 * POST /api/admin/users
 * Create a new user (Admin only)
 */
export async function POST(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const body = await req.json();
    const { name, email, role, password = 'password123' } = body;

    if (!name || !email || !role) {
      return error('Name, email, and role are required', 400);
    }

    // Check if user exists
    const existing = database.query('users', (u: any) => u.email === email)[0];
    if (existing) {
      return error('User with this email already exists', 409);
    }

    // Create user
    const newUser = database.create<User>('users', {
      name,
      email,
      role,
      passwordHash: hashPassword(password),
    });

    const { passwordHash, ...userResponse } = newUser;
    return success(userResponse, 201);
  } catch (err) {
    console.error('Failed to create user:', err);
    return error('Failed to create user', 500);
  }
}

/**
 * PATCH /api/admin/users
 * Bulk update users (Admin only)
 */
export async function PATCH(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const body = await req.json();
    const { userIds, updates } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return error('userIds array is required', 400);
    }

    if (!updates) {
      return error('updates object is required', 400);
    }

    // Don't allow password changes via bulk update
    delete updates.passwordHash;
    delete updates.password;

    const updated = [];
    for (const id of userIds) {
      const result = database.update('users', id, updates);
      if (result) {
        const { passwordHash, ...userResponse } = result;
        updated.push(userResponse);
      }
    }

    return success({ updated: updated.length, users: updated });
  } catch (err) {
    console.error('Failed to bulk update users:', err);
    return error('Failed to bulk update users', 500);
  }
}