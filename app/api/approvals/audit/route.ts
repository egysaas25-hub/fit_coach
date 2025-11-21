import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/approvals/audit - Get approval audit trail
 * Query params:
 * - tenant_id: Filter by tenant (required)
 * - entity_type: Filter by entity type (exercise, nutrition, workout)
 * - entity_id: Filter by specific entity
 * - reviewed_by: Filter by reviewer
 * - start_date: Filter by date range start
 * - end_date: Filter by date range end
 * - limit: Number of results (default 100)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenant_id")
    const entityType = searchParams.get("entity_type")
    const entityId = searchParams.get("entity_id")
    const reviewedBy = searchParams.get("reviewed_by")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const limit = parseInt(searchParams.get("limit") || "100")

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      )
    }

    // Build where clause
    const where: any = {
      tenant_id: BigInt(tenantId),
      status: {
        in: ["approved", "rejected"], // Only show completed reviews in audit
      },
    }

    if (entityType) {
      where.entity_type = entityType
    }

    if (entityId) {
      where.entity_id = BigInt(entityId)
    }

    if (reviewedBy) {
      where.reviewed_by = BigInt(reviewedBy)
    }

    // Date range filter
    if (startDate || endDate) {
      where.reviewed_at = {}
      if (startDate) {
        where.reviewed_at.gte = new Date(startDate)
      }
      if (endDate) {
        where.reviewed_at.lte = new Date(endDate)
      }
    }

    // Fetch audit trail
    const auditRecords = await prisma.approval_workflows.findMany({
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
        reviewed_at: "desc",
      },
      take: limit,
    })

    // Convert BigInt to string for JSON serialization
    const serializedRecords = auditRecords.map((record: any) => ({
      ...record,
      id: record.id.toString(),
      tenant_id: record.tenant_id.toString(),
      entity_id: record.entity_id.toString(),
      submitted_by: record.submitted_by.toString(),
      reviewed_by: record.reviewed_by?.toString() || null,
      submitted_by_team_member: record.submitted_by_team_member
        ? {
            ...record.submitted_by_team_member,
            id: record.submitted_by_team_member.id.toString(),
          }
        : null,
      reviewed_by_team_member: record.reviewed_by_team_member
        ? {
            ...record.reviewed_by_team_member,
            id: record.reviewed_by_team_member.id.toString(),
          }
        : null,
    }))

    // Calculate summary statistics
    const summary = {
      total: serializedRecords.length,
      approved: serializedRecords.filter((r: any) => r.status === "approved").length,
      rejected: serializedRecords.filter((r: any) => r.status === "rejected").length,
      by_entity_type: serializedRecords.reduce((acc: any, record: any) => {
        acc[record.entity_type] = (acc[record.entity_type] || 0) + 1
        return acc
      }, {}),
    }

    return NextResponse.json({
      audit_trail: serializedRecords,
      summary,
    })
  } catch (error) {
    console.error("Error fetching audit trail:", error)
    return NextResponse.json(
      { error: "Failed to fetch audit trail" },
      { status: 500 }
    )
  }
}
