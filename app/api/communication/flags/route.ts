import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/communication/flags - Get flags for messages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenant_id")
    const messageId = searchParams.get("message_id")
    const isResolved = searchParams.get("is_resolved")

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      )
    }

    let query = `
      SELECT 
        mf.*,
        tm1.first_name || ' ' || tm1.last_name as flagged_by_name,
        tm2.first_name || ' ' || tm2.last_name as resolved_by_name
      FROM message_flags mf
      JOIN team_members tm1 ON mf.flagged_by = tm1.member_id
      LEFT JOIN team_members tm2 ON mf.resolved_by = tm2.member_id
      WHERE mf.tenant_id = ${tenantId}::uuid
    `

    if (messageId) {
      query += ` AND mf.message_id = ${messageId}::uuid`
    }

    if (isResolved !== null) {
      query += ` AND mf.is_resolved = ${isResolved === "true"}`
    }

    query += ` ORDER BY mf.created_at DESC`

    const flags = await prisma.$queryRawUnsafe(query)

    return NextResponse.json({ flags })
  } catch (error) {
    console.error("Error fetching flags:", error)
    return NextResponse.json(
      { error: "Failed to fetch flags" },
      { status: 500 }
    )
  }
}

// POST /api/communication/flags - Flag a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenant_id, message_id, flagged_by, severity, reason } = body

    if (!tenant_id || !message_id || !flagged_by || !severity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const validSeverities = ["info", "coach", "warning", "critical"]
    if (!validSeverities.includes(severity)) {
      return NextResponse.json(
        { error: "Invalid severity level" },
        { status: 400 }
      )
    }

    const flag = await prisma.$queryRaw`
      INSERT INTO message_flags (
        tenant_id, message_id, flagged_by, severity, reason
      ) VALUES (
        ${tenant_id}::uuid,
        ${message_id}::uuid,
        ${flagged_by}::uuid,
        ${severity},
        ${reason || null}
      )
      RETURNING *
    `

    return NextResponse.json({ flag: flag[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating flag:", error)
    return NextResponse.json(
      { error: "Failed to create flag" },
      { status: 500 }
    )
  }
}

// PATCH /api/communication/flags/[id] - Resolve a flag
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { flag_id, resolved_by } = body

    if (!flag_id || !resolved_by) {
      return NextResponse.json(
        { error: "flag_id and resolved_by are required" },
        { status: 400 }
      )
    }

    const flag = await prisma.$queryRaw`
      UPDATE message_flags
      SET 
        is_resolved = true,
        resolved_by = ${resolved_by}::uuid,
        resolved_at = NOW()
      WHERE flag_id = ${flag_id}::uuid
      RETURNING *
    `

    return NextResponse.json({ flag: flag[0] })
  } catch (error) {
    console.error("Error resolving flag:", error)
    return NextResponse.json(
      { error: "Failed to resolve flag" },
      { status: 500 }
    )
  }
}
