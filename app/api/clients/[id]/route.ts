import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { auditService } from '@/lib/services/audit'
import { handleAPIError, AppError, ErrorResponses } from '@/lib/errors'
import { z } from 'zod'

// Validation schema for updating a client
const updateClientSchema = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().min(1).max(100).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  age: z.number().int().min(1).max(120).optional(),
  goal: z.string().max(255).optional(),
  status: z.enum(['lead', 'active', 'paused', 'expired', 'churned', 'paid_pending_kyc', 'lead_incomplete']).optional(),
})

/**
 * GET /api/clients/[id]
 * Fetch a single client by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    const clientId = BigInt(params.id)

    const client = await prisma.customers.findFirst({
      where: {
        id: clientId,
        tenant_id: BigInt(session.user.tenant_id),
      },
      include: {
        subscriptions: {
          orderBy: { created_at: 'desc' },
          take: 5,
        },
        training_plans: {
          where: { is_active: true },
          orderBy: { created_at: 'desc' },
          take: 1,
        },
        nutrition_plans: {
          where: { is_active: true },
          orderBy: { created_at: 'desc' },
          take: 1,
        },
      },
    })

    if (!client) {
      return ErrorResponses.notFound('Client')
    }

    // Serialize BigInt fields
    const serialized = {
      ...client,
      id: client.id.toString(),
      tenant_id: client.tenant_id.toString(),
      subscriptions: client.subscriptions.map(sub => ({
        ...sub,
        id: sub.id.toString(),
        tenant_id: sub.tenant_id.toString(),
        customer_id: sub.customer_id.toString(),
        currency_id: sub.currency_id.toString(),
      })),
      training_plans: client.training_plans.map(plan => ({
        ...plan,
        id: plan.id.toString(),
        tenant_id: plan.tenant_id.toString(),
        customer_id: plan.customer_id.toString(),
        created_by: plan.created_by.toString(),
      })),
      nutrition_plans: client.nutrition_plans.map(plan => ({
        ...plan,
        id: plan.id.toString(),
        tenant_id: plan.tenant_id.toString(),
        customer_id: plan.customer_id.toString(),
        created_by: plan.created_by.toString(),
      })),
    }

    return NextResponse.json(serialized)
  } catch (error) {
    return handleAPIError(error)
  }
}

/**
 * PATCH /api/clients/[id]
 * Update a client
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    const clientId = BigInt(params.id)
    const body = await request.json()

    // Validate input
    const data = updateClientSchema.parse(body)

    // Get existing client for audit log
    const existingClient = await prisma.customers.findFirst({
      where: {
        id: clientId,
        tenant_id: BigInt(session.user.tenant_id),
      },
    })

    if (!existingClient) {
      return ErrorResponses.notFound('Client')
    }

    // Update client
    const updatedClient = await prisma.customers.update({
      where: { id: clientId },
      data: {
        ...data,
        updated_at: new Date(),
      },
    })

    // Log to audit
    await auditService.logUpdate(
      session.user.tenant_id,
      session.user.id,
      'customer',
      Number(clientId),
      existingClient,
      updatedClient
    )

    // Serialize BigInt
    const serialized = {
      ...updatedClient,
      id: updatedClient.id.toString(),
      tenant_id: updatedClient.tenant_id.toString(),
    }

    return NextResponse.json(serialized)
  } catch (error) {
    return handleAPIError(error)
  }
}

/**
 * DELETE /api/clients/[id]
 * Soft delete a client
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    const clientId = BigInt(params.id)

    // Get existing client for audit log
    const existingClient = await prisma.customers.findFirst({
      where: {
        id: clientId,
        tenant_id: BigInt(session.user.tenant_id),
      },
    })

    if (!existingClient) {
      return ErrorResponses.notFound('Client')
    }

    // Soft delete by updating status
    const deletedClient = await prisma.customers.update({
      where: { id: clientId },
      data: {
        status: 'churned',
        updated_at: new Date(),
      },
    })

    // Log to audit
    await auditService.logDelete(
      session.user.tenant_id,
      session.user.id,
      'customer',
      Number(clientId),
      existingClient
    )

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
