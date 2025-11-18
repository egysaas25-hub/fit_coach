import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/plans/versions - Get plan versions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const planId = searchParams.get("plan_id")

    if (!planId) {
      return NextResponse.json(
        { error: "plan_id is required" },
        { status: 400 }
      )
    }

    const versions = await prisma.$queryRaw`
      SELECT 
        pv.*,
        tm.first_name || ' ' || tm.last_name as created_by_name
      FROM plan_versions pv
      LEFT JOIN team_members tm ON pv.created_by = tm.member_id
      WHERE pv.plan_id = ${planId}::uuid
      ORDER BY pv.created_at DESC
    `

    return NextResponse.json({ versions })
  } catch (error) {
    console.error("Error fetching versions:", error)
    return NextResponse.json(
      { error: "Failed to fetch versions" },
      { status: 500 }
    )
  }
}

// POST /api/plans/versions - Create new version
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan_id, tenant_id, content, change_log, bump_type = "minor", created_by } = body

    if (!plan_id || !tenant_id || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Bump version number
    const newVersion = await prisma.$queryRawUnsafe(`
      SELECT bump_plan_version('${plan_id}', '${bump_type}') as version_number
    `)

    const versionNumber = newVersion[0].version_number

    // Create new version
    const version = await prisma.$queryRaw`
      INSERT INTO plan_versions (
        plan_id, tenant_id, version_number, content, change_log, is_current, created_by
      ) VALUES (
        ${plan_id}::uuid,
        ${tenant_id}::uuid,
        ${versionNumber},
        ${JSON.stringify(content)}::jsonb,
        ${change_log || null},
        true,
        ${created_by ? `${created_by}::uuid` : null}
      )
      RETURNING *
    `

    return NextResponse.json({ version: version[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating version:", error)
    return NextResponse.json(
      { error: "Failed to create version" },
      { status: 500 }
    )
  }
}
