import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { success, error } from '@/lib/utils/response';
import { hashPassword } from '@/lib/auth/password';
import { withLogging } from '@/lib/middleware/logging.middleware';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/trainers
 * Get all trainers (Admin/Trainer access)
 */
const getHandler = async (req: NextRequest) => {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['trainer', 'admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    // Get team members with role 'coach' (which represents trainers)
    let query: any = {
      where: {
        tenant_id: tenantId,
        role: 'coach'
      }
    };

    // Search
    if (search) {
      query.where.full_name = { contains: search, mode: 'insensitive' };
    }

    const teamMembers = await prisma.team_members.findMany(query);

    // Paginate manually
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTeamMembers = teamMembers.slice(startIndex, endIndex);

    const pagination = {
      page,
      limit,
      total: teamMembers.length,
      pages: Math.ceil(teamMembers.length / limit)
    };

    // Format response
    const formattedTeamMembers = paginatedTeamMembers.map(member => ({
      id: member.id.toString(),
      name: member.full_name,
      email: member.email,
      role: 'trainer', // Map 'coach' role to 'trainer' for frontend
      createdAt: member.created_at,
      updatedAt: member.created_at // Team members don't have updated_at in schema
    }));

    return success({ data: formattedTeamMembers, pagination: pagination });
  } catch (err) {
    console.error('Failed to fetch trainers:', err);
    return error('Failed to fetch trainers', 500);
  }
};

export const GET = withLogging(getHandler);

/**
 * POST /api/trainers
 * Create a new trainer (Admin only)
 */
const postHandler = async (req: NextRequest) => {
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

    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    // Check if team member exists
    const existing = await prisma.team_members.findUnique({
      where: {
        uq_team_email: {
          tenant_id: tenantId,
          email: email
        }
      }
    });

    if (existing) {
      return error('Trainer with this email already exists', 409);
    }

    // Create team member with role 'coach'
    const newTeamMember = await prisma.team_members.create({
      data: {
        tenant_id: tenantId,
        full_name: name,
        email: email,
        role: 'coach'
      }
    });

    const trainerResponse = {
      id: newTeamMember.id.toString(),
      name: newTeamMember.full_name,
      email: newTeamMember.email,
      role: 'trainer', // Map 'coach' role to 'trainer' for frontend
      createdAt: newTeamMember.created_at,
      updatedAt: newTeamMember.created_at
    };

    return success(trainerResponse, 201);
  } catch (err) {
    console.error('Failed to create trainer:', err);
    return error('Failed to create trainer', 500);
  }
};

export const POST = withLogging(postHandler);