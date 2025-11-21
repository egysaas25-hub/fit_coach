import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { auditService } from '@/lib/services/audit'
import { handleAPIError, AppError } from '@/lib/errors'
import { z } from 'zod'

// Validation schema for bulk delete
const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one client ID is required'),
})

/**
 * POST /api/clients/bulk-delete
 * Soft delete multiple clients at once
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request)
    const body = await request.json()

    // Validate input
    const { ids } = bulkDeleteSchema.parse(body)

    // Convert string IDs to BigInt
    const clientIds = ids.map(id => BigInt(id))

    // Verify all clients belong to the tenant
    const clients = await prisma.customers.findMany({
      where: {
        id: { in: clientIds },
        tenant_id: BigInt(session.user.tenant_id),
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        status: true,
      },
    })

    // Check if all requested clients were found
    if (clients.length !== ids.length) {
      throw new AppError(
        'Some clients were not found or do not belong to your organization',
        404,
        'CLIENTS_NOT_FOUND'
      )
    }

    // Perform bulk soft delete by updating status to 'churned'
    const result = await prisma.customers.updateMany({
      where: {
        id: { in: clientIds },
        tenant_id: BigInt(session.user.tenant_id),
      },
      data: {
        status: 'churned',
        updated_at: new Date(),
      },
    })

    // Log each deletion to audit trail
    await Promise.all(
      clients.map(client =>
        auditService.logDelete(
          session.user.tenant_id,
          session.user.id,
          'customer',
          Number(client.id),
          client
        )
      )
    )

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} client${result.count !== 1 ? 's' : ''}`,
      count: result.count,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
