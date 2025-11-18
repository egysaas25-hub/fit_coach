import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/exercises/approve
 * Approve or reject an exercise
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      exercise_id,
      reviewer_id,
      status, // approved, rejected, changes_requested
      comments,
    } = body

    if (!exercise_id || !reviewer_id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const validStatuses = ["approved", "rejected", "changes_requested"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    // Update exercise status
    const exercise = await prisma.$queryRaw`
      UPDATE exercises
      SET 
        status = ${status},
        reviewed_by = ${reviewer_id}::uuid,
        reviewed_at = NOW(),
        rejection_reason = ${status === "rejected" ? comments : null},
        updated_at = NOW()
      WHERE exercise_id = ${exercise_id}::uuid
      RETURNING *
    `

    if (!exercise[0]) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      )
    }

    // Create approval record
    await prisma.$executeRaw`
      INSERT INTO exercise_approvals (
        tenant_id, exercise_id, requested_by, reviewer_id, status, comments, reviewed_at
      )
      SELECT 
        e.tenant_id,
        e.exercise_id,
        e.created_by,
        ${reviewer_id}::uuid,
        ${status},
        ${comments || null},
        NOW()
      FROM exercises e
      WHERE e.exercise_id = ${exercise_id}::uuid
    `

    // TODO: Send notification to creator

    return NextResponse.json({
      success: true,
      exercise: exercise[0],
      message: `Exercise ${status}`,
    })
  } catch (error) {
    console.error("Approval error:", error)
    return NextResponse.json(
      { error: "Failed to process approval" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/exercises/approve
 * Get exercises pending approval
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenant_id")

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      )
    }

    const exercises = await prisma.$queryRaw`
      SELECT 
        e.*,
        ec.name as category_name,
        bp.name as body_part_name,
        eq.name as equipment_name,
        tm.first_name || ' ' || tm.last_name as created_by_name
      FROM exercises e
      LEFT JOIN exercise_categories ec ON e.category_id = ec.category_id
      LEFT JOIN body_parts bp ON e.body_part_id = bp.body_part_id
      LEFT JOIN equipment_types eq ON e.equipment_id = eq.equipment_id
      LEFT JOIN team_members tm ON e.created_by = tm.member_id
      WHERE e.tenant_id = ${tenantId}::uuid
        AND e.status = 'pending_review'
      ORDER BY e.created_at DESC
    `

    return NextResponse.json({ exercises })
  } catch (error) {
    console.error("Error fetching pending exercises:", error)
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    )
  }
}
