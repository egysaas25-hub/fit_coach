import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/settings/integrations
 * Fetch all integrations for the current tenant
 */
export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getSession(request)
    const tenantId = session.user.tenant_id

    // Fetch integrations
    const integrations = await prisma.integrations.findMany({
      where: {
        tenant_id: tenantId,
      },
      orderBy: [
        { is_enabled: 'desc' },
        { name: 'asc' },
      ],
      select: {
        id: true,
        name: true,
        provider: true,
        type: true,
        is_enabled: true,
        created_at: true,
        updated_at: true,
      },
    })

    // Convert BigInt to string for JSON serialization
    const serializedIntegrations = integrations.map(integration => ({
      ...integration,
      id: integration.id.toString(),
      created_at: integration.created_at.toISOString(),
      updated_at: integration.updated_at.toISOString(),
    }))

    return NextResponse.json({
      integrations: serializedIntegrations,
      total: integrations.length,
    })
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch integrations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
