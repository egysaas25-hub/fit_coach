import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { success, error } from '@/lib/utils/response';
import { hashPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/users
 * Get all users (Admin only)
 */
export async function GET(req: NextRequest) {
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

    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    // Get clients and team members based on role filter
    let clients: any[] = [];
    let teamMembers: any[] = [];

    if (!role || role === 'client') {
      // Get clients
      let clientQuery: any = {
        where: {
          tenant_id: tenantId
        }
      };

      if (search) {
        clientQuery.where.OR = [
          { first_name: { contains: search, mode: 'insensitive' } },
          { last_name: { contains: search, mode: 'insensitive' } },
          { phone_e164: { contains: search, mode: 'insensitive' } }
        ];
      }

      clients = await prisma.customers.findMany(clientQuery);
    }

    if (!role || role !== 'client') {
      // Get team members
      let teamQuery: any = {
        where: {
          tenant_id: tenantId
        }
      };

      if (role) {
        // Map role to database role
        const dbRole = role === 'trainer' ? 'coach' : role;
        teamQuery.where.role = dbRole;
      }

      if (search) {
        teamQuery.where.full_name = { contains: search, mode: 'insensitive' };
      }

      teamMembers = await prisma.team_members.findMany(teamQuery);
    }

    // Combine and format users
    let users: any[] = [];

    // Format clients
    const formattedClients = clients.map(client => ({
      id: client.id.toString(),
      name: `${client.first_name || ''} ${client.last_name || ''}`.trim(),
      email: '', // Clients don't have email
      phone: client.phone_e164,
      role: 'client',
      createdAt: client.created_at,
      updatedAt: client.updated_at
    }));

    // Format team members
    const formattedTeamMembers = teamMembers.map(member => ({
      id: member.id.toString(),
      name: member.full_name,
      email: member.email,
      phone: '', // Team members don't have phone in this schema
      role: member.role === 'coach' ? 'trainer' : member.role,
      createdAt: member.created_at,
      updatedAt: member.created_at // Team members don't have updated_at in schema
    }));

    users = [...formattedClients, ...formattedTeamMembers];

    // Sort by creation date (newest first)
    users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    const pagination = {
      page,
      limit,
      total: users.length,
      pages: Math.ceil(users.length / limit)
    };

    return success({ data: paginatedUsers, pagination });
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
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const body = await req.json();
    const { name, email, role, password = 'password123', phone } = body;

    if (!name || !role) {
      return error('Name and role are required', 400);
    }

    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    if (role === 'client') {
      // Check if client exists
      if (!phone) {
        return error('Phone number is required for clients', 400);
      }

      const existingClient = await prisma.customers.findUnique({
        where: {
          uq_customer_phone: {
            tenant_id: tenantId,
            phone_e164: phone
          }
        }
      });

      if (existingClient) {
        return error('Client with this phone number already exists', 409);
      }

      // Create client
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      const newUser = await prisma.customers.create({
        data: {
          tenant_id: tenantId,
          phone_e164: phone,
          first_name: firstName,
          last_name: lastName,
          source: 'sales', // Use 'sales' as a valid source enum value
          status: 'lead'
        }
      });

      return success({
        id: newUser.id.toString(),
        name: `${newUser.first_name || ''} ${newUser.last_name || ''}`.trim(),
        email: '',
        phone: newUser.phone_e164,
        role: 'client',
        createdAt: newUser.created_at,
        updatedAt: newUser.updated_at
      }, 201);
    } else {
      // Check if team member exists
      if (!email) {
        return error('Email is required for team members', 400);
      }

      const existingTeamMember = await prisma.team_members.findUnique({
        where: {
          uq_team_email: {
            tenant_id: tenantId,
            email: email
          }
        }
      });

      if (existingTeamMember) {
        return error('Team member with this email already exists', 409);
      }

      // Map role to database role
      const dbRole = role === 'trainer' ? 'coach' : role;

      // Create team member
      const newUser = await prisma.team_members.create({
        data: {
          tenant_id: tenantId,
          full_name: name,
          email: email,
          role: dbRole
        }
      });

      return success({
        id: newUser.id.toString(),
        name: newUser.full_name,
        email: newUser.email,
        phone: '',
        role: newUser.role === 'coach' ? 'trainer' : newUser.role,
        createdAt: newUser.created_at,
        updatedAt: newUser.created_at
      }, 201);
    }
  } catch (err: any) {
    console.error('Failed to create user:', err);
    // Check if it's a Prisma error about the source enum
    if (err.code === 'P2009') {
      return error('Invalid source value. Please use one of: landing, social, sales, referral, campaign, post_payment', 400);
    }
    return error('Failed to create user', 500);
  }
}

/**
 * PATCH /api/admin/users
 * Bulk update users (Admin only)
 */
export async function PATCH(req: NextRequest) {
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

    // Hardcoded tenant_id for now
    const tenantId = BigInt(1);

    const updated = [];
    for (const id of userIds) {
      try {
        const userId = BigInt(id);

        // Try to find as client first
        let clientResult = await prisma.customers.findUnique({
          where: { id: userId }
        });

        if (clientResult) {
          // Update client
          const updateData: any = {};
          if (updates.name) {
            const [firstName, ...lastNameParts] = updates.name.split(' ');
            updateData.first_name = firstName;
            updateData.last_name = lastNameParts.join(' ') || '';
          }
          if (updates.phone) updateData.phone_e164 = updates.phone;
          if (updates.status) updateData.status = updates.status;

          const updatedClient = await prisma.customers.update({
            where: { id: userId },
            data: updateData
          });

          updated.push({
            id: updatedClient.id.toString(),
            name: `${updatedClient.first_name || ''} ${updatedClient.last_name || ''}`.trim(),
            email: '',
            phone: updatedClient.phone_e164,
            role: 'client',
            createdAt: updatedClient.created_at,
            updatedAt: updatedClient.updated_at
          });
        } else {
          // Try to find as team member
          let teamMemberResult = await prisma.team_members.findUnique({
            where: { id: userId }
          });

          if (teamMemberResult) {
            // Update team member
            const updateData: any = {};
            if (updates.name) updateData.full_name = updates.name;
            if (updates.email) updateData.email = updates.email;

            const updatedTeamMember = await prisma.team_members.update({
              where: { id: userId },
              data: updateData
            });

            updated.push({
              id: updatedTeamMember.id.toString(),
              name: updatedTeamMember.full_name,
              email: updatedTeamMember.email,
              phone: '',
              role: updatedTeamMember.role === 'coach' ? 'trainer' : updatedTeamMember.role,
              createdAt: updatedTeamMember.created_at,
              updatedAt: updatedTeamMember.created_at
            });
          }
        }
      } catch (err) {
        console.error(`Failed to update user ${id}:`, err);
        // Continue with other updates
      }
    }

    return success({ updated: updated.length, users: updated });
  } catch (err) {
    console.error('Failed to bulk update users:', err);
    return error('Failed to bulk update users', 500);
  }
}