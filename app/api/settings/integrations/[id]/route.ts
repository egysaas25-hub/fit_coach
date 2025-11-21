import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'

/**
 * PATCH /api/settings/integrations/[id]
 * Update integration settings (primarily enable/disable status)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session
    const session = await getSession(request)
    const tenantId = session.user.tenant_id
    const integrationId = params.id

    // Parse request body
    const body = await request.json()
    const { is_enabled } = body

    // Validate input
    if (typeof is_enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid input', message: 'is_enabled must be a boolean' },
        { status: 400 }
      )
    }

    // Check if integration exists and belongs to tenant
    const existingIntegration = await prisma.integrations.findFirst({
      where: {
        id: BigInt(integrationId),
        tenant_id: tenantId,
      },
    })

    if (!existingIntegration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    // Update integration
    const updatedIntegration = await prisma.integrations.update({
      where: {
        id: BigInt(integrationId),
      },
      data: {
        is_enabled,
        updated_at: new Date(),
      },
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
    const serializedIntegration = {
      ...updatedIntegration,
      id: updatedIntegration.id.toString(),
      created_at: updatedIntegration.created_at.toISOString(),
      updated_at: updatedIntegration.updated_at.toISOString(),
    }

    return NextResponse.json({
      integration: serializedIntegration,
      message: `Integration ${is_enabled ? 'enabled' : 'disabled'} successfully`,
    })
  } catch (error) {
    console.error('Error updating integration:', error)
    
    // Handle specific errors
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json(
        { error: 'Invalid integration ID' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to update integration',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/settings/integrations/[id]
 * Get a specific integration by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session
    const session = await getSession(request)
    const tenantId = session.user.tenant_id
    const integrationId = params.id

    // Fetch integration
    const integration = await prisma.integrations.findFirst({
      where: {
        id: BigInt(integrationId),
        tenant_id: tenantId,
      },
      select: {
        id: true,
        name: true,
        provider: true,
        type: true,
        base_url: true,
        docs_url: true,
        is_enabled: true,
        created_at: true,
        updated_at: true,
      },
    })

    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    // Convert BigInt to string for JSON serialization
    const serializedIntegration = {
      ...integration,
      id: integration.id.toString(),
      created_at: integration.created_at.toISOString(),
      updated_at: integration.updated_at.toISOString(),
    }

    return NextResponse.json({
      integration: serializedIntegration,
    })
  } catch (error) {
    console.error('Error fetching integration:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch integration',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
