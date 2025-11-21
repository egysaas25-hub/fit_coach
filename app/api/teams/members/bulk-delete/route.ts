import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/services/auth'
import { auditService } from '@/lib/services/audit'
import { handleAPIError, AppError } from '@/lib/errors'
import { z } from 'zod'

// Validation schema for bulk delete
const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one member ID is required'),
})

/**
 * POST /api/teams/members/bulk-delete
 * Deactivate multiple team members at once
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request)
    const body = await request.json()

    // Validate input
    const { ids } = bulkDeleteSchema.parse(body)

    // Convert string IDs to BigInt
    const memberIds = ids.map(id => BigInt(id))

    // Verify all members belong to the tenant
    const members = await prisma.team_members.findMany({
      where: {
        id: { in: memberIds },
        tenant_id: BigInt(session.user.tenant_id),
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        active: true,
      },
    })

    // Check if all requested members were found
    if (members.length !== ids.length) {
      throw new AppError(
        'Some team members were not found or do not belong to your organization',
        404,
        'MEMBERS_NOT_FOUND'
      )
    }

    // Prevent deactivating the last active admin
    const activeAdmins = await prisma.team_members.count({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        role: 'admin',
        active: true,
      },
    })

    const adminsToDeactivate = members.filter(
      m => m.role === 'admin' && m.active
    ).length

    if (activeAdmins - adminsToDeactivate < 1) {
      throw new AppError(
        'Cannot deactivate all admin users. At least one admin must remain active.',
        400,
        'LAST_ADMIN_ERROR'
      )
    }

    // Perform bulk deactivation
    const result = await prisma.team_members.updateMany({
      where: {
        id: { in: memberIds },
        tenant_id: BigInt(session.user.tenant_id),
      },
      data: {
        active: false,
        updated_at: new Date(),
      },
    })

    // Log each deactivation to audit trail
    await Promise.all(
      members.map(member =>
        auditService.logAction(session, {
          entity: 'team_member',
          action: 'deactivated',
          entityId: member.id.toString(),
          changes: { active: false },
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: `Successfully deactivated ${result.count} team member${result.count !== 1 ? 's' : ''}`,
      count: result.count,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
