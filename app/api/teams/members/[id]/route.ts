import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/services/auth'
import { auditService } from '@/lib/services/audit'
import { handleAPIError, NotFoundError, ValidationError } from '@/lib/errors'
import { z } from 'zod'

// Validation schema for updates
const updateMemberSchema = z.object({
  full_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone_e164: z.string().regex(/^\+[0-9]{1,3}[0-9]{6,14}$/).optional(),
  role: z.enum(['admin', 'superior_trainer', 'senior_trainer', 'junior_trainer', 'sales', 'support', 'finance']).optional(),
  max_caseload: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
})

/**
 * GET /api/teams/members/[id] - Get team member details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    const memberId = BigInt(params.id)

    const member = await prisma.team_members.findFirst({
      where: {
        id: memberId,
        tenant_id: BigInt(session.user.tenant_id),
      },
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
    })

    if (!member) {
      throw new NotFoundError('Team member not found')
    }

    // Get assigned clients count
    const assignedClients = await prisma.customers.count({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        assigned_trainer_id: member.id,
        deleted_at: null,
        status: { in: ['active', 'trial'] },
      },
    })

    // Calculate workload
    const workloadIndex = member.max_caseload && member.max_caseload > 0
      ? Math.round((assignedClients / member.max_caseload) * 100)
      : 0

    // Get recent activity
    const recentActivity = await prisma.audit_log.findMany({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        actor_id: member.id,
      },
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        action: true,
        entity_type: true,
        created_at: true,
      },
    })

    return NextResponse.json({
      ...member,
      id: member.id.toString(),
      assigned_clients: assignedClients,
      workload_index: workloadIndex,
      recent_activity: recentActivity,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}

/**
 * PATCH /api/teams/members/[id] - Update team member
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    const memberId = BigInt(params.id)
    const body = await request.json()

    // Validate input
    const data = updateMemberSchema.parse(body)

    // Check if member exists
    const existingMember = await prisma.team_members.findFirst({
      where: {
        id: memberId,
        tenant_id: BigInt(session.user.tenant_id),
      },
    })

    if (!existingMember) {
      throw new NotFoundError('Team member not found')
    }

    // Check for duplicate email if email is being updated
    if (data.email && data.email !== existingMember.email) {
      const duplicateEmail = await prisma.team_members.findFirst({
        where: {
          tenant_id: BigInt(session.user.tenant_id),
          email: data.email,
          id: { not: memberId },
        },
      })

      if (duplicateEmail) {
        throw new ValidationError('A team member with this email already exists')
      }
    }

    // Check for duplicate phone if phone is being updated
    if (data.phone_e164 && data.phone_e164 !== existingMember.phone_e164) {
      const duplicatePhone = await prisma.team_members.findFirst({
        where: {
          tenant_id: BigInt(session.user.tenant_id),
          phone_e164: data.phone_e164,
          id: { not: memberId },
        },
      })

      if (duplicatePhone) {
        throw new ValidationError('A team member with this phone number already exists')
      }
    }

    // Update member
    const updatedMember = await prisma.team_members.update({
      where: { id: memberId },
      data: {
        ...(data.full_name && { full_name: data.full_name }),
        ...(data.email && { email: data.email }),
        ...(data.phone_e164 && { phone_e164: data.phone_e164 }),
        ...(data.role && { role: data.role }),
        ...(data.max_caseload !== undefined && { max_caseload: data.max_caseload }),
        ...(data.active !== undefined && { active: data.active }),
        updated_at: new Date(),
      },
    })

    // Log to audit trail
    await auditService.logAction(session, {
      entity: 'team_member',
      action: 'updated',
      entityId: memberId.toString(),
      changes: data,
    })

    return NextResponse.json({
      id: updatedMember.id.toString(),
      full_name: updatedMember.full_name,
      email: updatedMember.email,
      phone_e164: updatedMember.phone_e164,
      role: updatedMember.role,
      max_caseload: updatedMember.max_caseload,
      active: updatedMember.active,
      updated_at: updatedMember.updated_at,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}

/**
 * DELETE /api/teams/members/[id] - Deactivate team member
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    const memberId = BigInt(params.id)

    // Check if member exists
    const member = await prisma.team_members.findFirst({
      where: {
        id: memberId,
        tenant_id: BigInt(session.user.tenant_id),
      },
    })

    if (!member) {
      throw new NotFoundError('Team member not found')
    }

    // Deactivate instead of hard delete
    await prisma.team_members.update({
      where: { id: memberId },
      data: {
        active: false,
        updated_at: new Date(),
      },
    })

    // Log to audit trail
    await auditService.logAction(session, {
      entity: 'team_member',
      action: 'deactivated',
      entityId: memberId.toString(),
      changes: { active: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleAPIError(error)
  }
}
