import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { database, Trainer } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { hashPassword } from '@/lib/auth/password';
import { ensureDbInitialized } from '@/lib/db/init';

/**
 * GET /api/trainers
 * Get all trainers (Admin/Trainer access)
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['trainer', 'admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    let trainers = database.getAll<Trainer>('trainers');

    // Search
    if (search) {
      trainers = database.search('trainers', search, ['name', 'email']);
    }

    // Paginate
    const result = database.paginate(trainers, page, limit);

    // Remove sensitive data
    const sanitized = result.data.map(({ passwordHash, ...t }) => t);

    return success({ data: sanitized, pagination: result.pagination });
  } catch (err) {
    console.error('Failed to fetch trainers:', err);
    return error('Failed to fetch trainers', 500);
  }
}

/**
 * POST /api/trainers
 * Create a new trainer (Admin only)
 */
export async function POST(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const body = await req.json();
    const { name, email, password = 'password123' } = body;

    if (!name || !email) {
      return error('Name and email are required', 400);
    }

    // Check if trainer exists
    const existing = database.query('trainers', (t: any) => t.email === email)[0];
    if (existing) {
      return error('Trainer with this email already exists', 409);
    }

    // Create trainer
    const newTrainer = database.create<Trainer>('trainers', {
      name,
      email,
      role: 'trainer',
      passwordHash: hashPassword(password),
    });

    const { passwordHash, ...trainerResponse } = newTrainer;
    return success(trainerResponse, 201);
  } catch (err) {
    console.error('Failed to create trainer:', err);
    return error('Failed to create trainer', 500);
  }
}