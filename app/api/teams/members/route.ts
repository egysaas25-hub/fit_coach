import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/services/auth'
import { auditService } from '@/lib/services/audit'
import { handleAPIError, ValidationError } from '@/lib/errors'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Validation schema for team member
const createMemberSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone_e164: z.string().regex(/^\+[0-9]{1,3}[0-9]{6,14}$/, 'Invalid phone number format'),
  role: z.enum(['admin', 'superior_trainer', 'senior_trainer', 'junior_trainer', 'sales', 'support', 'finance']),
  max_caseload: z.number().int().min(0).optional(),
})

const updateMemberSchema = z.object({
  full_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone_e164: z.string().regex(/^\+[0-9]{1,3}[0-9]{6,14}$/).optional(),
  role: z.enum(['admin', 'superior_trainer', 'senior_trainer', 'junior_trainer', 'sales', 'support', 'finance']).optional(),
  max_caseload: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
})

/**
 * GET /api/teams/members - Fetch team members with filters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role')
    const active = searchParams.get('active')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {
      tenant_id: BigInt(session.user.tenant_id),
    }

    if (role) {
      where.role = role
    }

    if (active !== null && active !== undefined && active !== '') {
      where.active = active === 'true'
    }

    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone_e164: { contains: search } },
      ]
    }

    // Fetch members with pagination
    const [members, total] = await Promise.all([
      prisma.team_members.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          full_name: true,
          email: true,
          phone_e164: true,
          role: true,
          max_caseload: true,
          active: true,
          created_at: true,
          updated_at: true,
        },
      }),
      prisma.team_members.count({ where }),
    ])

    // Calculate assigned clients count and workload for each member
    const membersWithStats = await Promise.all(
      members.map(async (member) => {
        const assignedClients = await prisma.customers.count({
          where: {
            tenant_id: BigInt(session.user.tenant_id),
            assigned_trainer_id: member.id,
            deleted_at: null,
            status: { in: ['active', 'trial'] },
          },
        })

        const workloadIndex = member.max_caseload && member.max_caseload > 0
          ? Math.round((assignedClients / member.max_caseload) * 100)
          : 0

        // Calculate KPIs (simplified for now)
        const avgResponseTime = await prisma.$queryRaw<Array<{ avg_response_time: number }>>`
          SELECT AVG(EXTRACT(EPOCH FROM (responded_at - created_at))) as avg_response_time
          FROM interactions
          WHERE tenant_id = ${BigInt(session.user.tenant_id)}
            AND responder_id = ${member.id}
            AND responded_at IS NOT NULL
            AND created_at >= NOW() - INTERVAL '30 days'
        `

        return {
          ...member,
          id: member.id.toString(),
          assigned_clients: assignedClients,
          workload_index: workloadIndex,
          avg_response_time_seconds: avgResponseTime[0]?.avg_response_time || null,
        }
      })
    )

    return NextResponse.json({
      members: membersWithStats,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    return handleAPIError(error)
  }
}

/**
 * POST /api/teams/members - Add new team member
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request)
    const body = await request.json()

    // Validate input
    const data = createMemberSchema.parse(body)

    // Check for duplicate email within tenant
    const existingEmail = await prisma.team_members.findFirst({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        email: data.email,
      },
    })

    if (existingEmail) {
      throw new ValidationError('A team member with this email already exists')
    }

    // Check for duplicate phone within tenant
    const existingPhone = await prisma.team_members.findFirst({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        phone_e164: data.phone_e164,
      },
    })

    if (existingPhone) {
      throw new ValidationError('A team member with this phone number already exists')
    }

    // Create team member
    const member = await prisma.team_members.create({
      data: {
        tenant_id: BigInt(session.user.tenant_id),
        full_name: data.full_name,
        email: data.email,
        phone_e164: data.phone_e164,
        role: data.role,
        max_caseload: data.max_caseload || null,
        active: true,
      },
    })

    // Log to audit trail
    await auditService.logAction(session, {
      entity: 'team_member',
      action: 'created',
      entityId: member.id.toString(),
      changes: {
        full_name: data.full_name,
        email: data.email,
        role: data.role,
      },
    })

    // TODO: Send invitation email with OTP setup link
    // await emailService.sendInvitation(member.email, member.full_name)

    return NextResponse.json({
      id: member.id.toString(),
      full_name: member.full_name,
      email: member.email,
      phone_e164: member.phone_e164,
      role: member.role,
      max_caseload: member.max_caseload,
      active: member.active,
      created_at: member.created_at,
    }, { status: 201 })
  } catch (error) {
    return handleAPIError(error)
  }
}
