import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/services/auth'
import { handleAPIError } from '@/lib/errors'

/**
 * GET /api/clients/goals - Get unique client goals for filter dropdown
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)

    // Get unique goals from clients in this tenant
    const goals = await prisma.customers.findMany({
      where: {
        tenant_id: BigInt(session.user.tenant_id),
        deleted_at: null,
        goal: {
          not: null,
        },
      },
      select: {
        goal: true,
      },
      distinct: ['goal'],
      orderBy: {
        goal: 'asc',
      },
    })

    const options = goals
      .map((client) => client.goal)
      .filter((goal): goal is string => goal !== null)

    return NextResponse.json({ options })
  } catch (error) {
    return handleAPIError(error)
  }
}
