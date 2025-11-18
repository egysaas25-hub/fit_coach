import { NextRequest, NextResponse } from "next/server"
import { autoDelivery } from "@/lib/services/auto-delivery"

/**
 * POST /api/plans/assignments/deliver
 * Trigger auto-delivery for plan assignment(s)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assignment_id, assignment_ids, tenant_id } = body

    if (!tenant_id) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      )
    }

    // Single assignment delivery
    if (assignment_id) {
      const result = await autoDelivery.deliverPlan({
        assignmentId: assignment_id,
        tenantId: tenant_id,
      })

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Delivery failed" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        assignment_id,
        pdf_url: result.pdfUrl,
        portal_link: result.portalLink,
      })
    }

    // Batch delivery
    if (assignment_ids && Array.isArray(assignment_ids)) {
      const results = await autoDelivery.deliverBatch(assignment_ids, tenant_id)

      const successful = results.filter((r) => r.success).length
      const failed = results.filter((r) => !r.success).length

      return NextResponse.json({
        success: true,
        total: results.length,
        successful,
        failed,
        results,
      })
    }

    return NextResponse.json(
      { error: "Either assignment_id or assignment_ids is required" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Delivery trigger error:", error)
    return NextResponse.json(
      { error: "Failed to trigger delivery" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/plans/assignments/deliver/retry
 * Retry failed delivery
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { assignment_id, tenant_id } = body

    if (!assignment_id || !tenant_id) {
      return NextResponse.json(
        { error: "assignment_id and tenant_id are required" },
        { status: 400 }
      )
    }

    const result = await autoDelivery.retryDelivery(assignment_id, tenant_id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Retry failed" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      assignment_id,
      pdf_url: result.pdfUrl,
      portal_link: result.portalLink,
    })
  } catch (error) {
    console.error("Delivery retry error:", error)
    return NextResponse.json(
      { error: "Failed to retry delivery" },
      { status: 500 }
    )
  }
}
