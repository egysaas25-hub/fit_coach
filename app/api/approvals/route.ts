import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/approvals - List approval workflows
 * Query params:
 * - tenant_id: Filter by tenant
 * - status: Filter by status (pending, approved, rejected)
 * - entity_type: Filter by entity type (exercise, nutrition, workout)
 * - submitted_by: Filter by submitter
 * - limit: Number of results (default 50)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenant_id")
    const status = searchParams.get("status") || "pending"
    const entityType = searchParams.get("entity_type")
    const submittedBy = searchParams.get("submitted_by")
    const limit = parseInt(searchParams.get("limit") || "50")

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      )
    }

    // Build where clause
    const where: any = {
      tenant_id: BigInt(tenantId),
    }

    if (status && status !== "all") {
      where.status = status
    }

    if (entityType) {
      where.entity_type = entityType
    }

    if (submittedBy) {
      where.submitted_by = BigInt(submittedBy)
    }

    // Fetch approval workflows with related data
    const approvals = await prisma.approval_workflows.findMany({
      where,
      include: {
        submitted_by_team_member: {
          select: {
            id: true,
            full_name: true,
            email: true,
            role: true,
          },
        },
        reviewed_by_team_member: {
          select: {
            id: true,
            full_name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
    })

    // Convert BigInt to string for JSON serialization
    const serializedApprovals = approvals.map((approval: any) => ({
      ...approval,
      id: approval.id.toString(),
      tenant_id: approval.tenant_id.toString(),
      entity_id: approval.entity_id.toString(),
      submitted_by: approval.submitted_by.toString(),
      reviewed_by: approval.reviewed_by?.toString() || null,
      submitted_by_team_member: approval.submitted_by_team_member
        ? {
            ...approval.submitted_by_team_member,
            id: approval.submitted_by_team_member.id.toString(),
          }
        : null,
      reviewed_by_team_member: approval.reviewed_by_team_member
        ? {
            ...approval.reviewed_by_team_member,
            id: approval.reviewed_by_team_member.id.toString(),
          }
        : null,
    }))

    return NextResponse.json({
      approvals: serializedApprovals,
      count: serializedApprovals.length,
    })
  } catch (error) {
    console.error("Error fetching approvals:", error)
    return NextResponse.json(
      { error: "Failed to fetch approvals" },
      { status: 500 }
    )
  }
}
