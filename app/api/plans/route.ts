import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/plans - List plans
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenant_id")
    const planType = searchParams.get("type")
    const status = searchParams.get("status")

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      )
    }

    let query = `
      SELECT 
        p.*,
        pv.version_id,
        pv.content,
        tm.first_name || ' ' || tm.last_name as created_by_name,
        (
          SELECT COUNT(*)
          FROM plan_assignments pa
          WHERE pa.plan_id = p.plan_id AND pa.status = 'active'
        ) as active_assignments
      FROM plans p
      LEFT JOIN plan_versions pv ON p.plan_id = pv.plan_id AND pv.is_current = true
      LEFT JOIN team_members tm ON p.created_by = tm.member_id
      WHERE p.tenant_id = '${tenantId}'
    `

    if (planType) {
      query += ` AND p.plan_type = '${planType}'`
    }

    if (status) {
      query += ` AND p.status = '${status}'`
    }

    query += ` ORDER BY p.updated_at DESC`

    const plans = await prisma.$queryRawUnsafe(query)

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Error fetching plans:", error)
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    )
  }
}

// POST /api/plans - Create plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenant_id, plan_type, name, description, content, created_by } = body

    if (!tenant_id || !plan_type || !name || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const validTypes = ["training", "nutrition", "bundle"]
    if (!validTypes.includes(plan_type)) {
      return NextResponse.json(
        { error: "Invalid plan_type" },
        { status: 400 }
      )
    }

    // Create plan
    const plan = await prisma.$queryRaw`
      INSERT INTO plans (
        tenant_id, plan_type, name, description, created_by, status
      ) VALUES (
        ${tenant_id}::uuid,
        ${plan_type}::plan_type,
        ${name},
        ${description || null},
        ${created_by ? `${created_by}::uuid` : null},
        'draft'::plan_status
      )
      RETURNING *
    `

    const planId = plan[0].plan_id

    // Create initial version
    const version = await prisma.$queryRaw`
      INSERT INTO plan_versions (
        plan_id, tenant_id, version_number, content, is_current, created_by
      ) VALUES (
        ${planId}::uuid,
        ${tenant_id}::uuid,
        '1.0',
        ${JSON.stringify(content)}::jsonb,
        true,
        ${created_by ? `${created_by}::uuid` : null}
      )
      RETURNING *
    `

    return NextResponse.json(
      { plan: plan[0], version: version[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating plan:", error)
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    )
  }
}

// PATCH /api/plans/[id] - Update plan
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan_id, name, description, status } = body

    if (!plan_id) {
      return NextResponse.json(
        { error: "plan_id is required" },
        { status: 400 }
      )
    }

    const updates = []
    if (name) updates.push(`name = '${name}'`)
    if (description !== undefined) updates.push(`description = '${description}'`)
    if (status) updates.push(`status = '${status}'::plan_status`)
    updates.push(`updated_at = NOW()`)

    const plan = await prisma.$queryRawUnsafe(`
      UPDATE plans
      SET ${updates.join(", ")}
      WHERE plan_id = '${plan_id}'
      RETURNING *
    `)

    return NextResponse.json({ plan: plan[0] })
  } catch (error) {
    console.error("Error updating plan:", error)
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    )
  }
}
