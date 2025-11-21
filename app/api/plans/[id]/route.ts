import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: { id: string }
}

// GET /api/plans/:id - Get single plan
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const planId = params.id

    // Get plan with current version
    const plan = await prisma.$queryRaw<any[]>`
      SELECT 
        p.*,
        pv.version_id,
        pv.content,
        pv.version_number,
        tm.first_name || ' ' || tm.last_name as created_by_name
      FROM plans p
      LEFT JOIN plan_versions pv ON p.plan_id = pv.plan_id AND pv.is_current = true
      LEFT JOIN team_members tm ON p.created_by = tm.member_id
      WHERE p.plan_id = ${planId}::uuid
      LIMIT 1
    `

    if (!plan || plan.length === 0) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ plan: plan[0] })
  } catch (error) {
    console.error("Error fetching plan:", error)
    return NextResponse.json(
      { error: "Failed to fetch plan" },
      { status: 500 }
    )
  }
}

// PUT /api/plans/:id - Update plan
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const planId = params.id
    const body = await request.json()
    const { name, description, content, status } = body

    // Check if plan exists
    const existingPlan = await prisma.$queryRaw<any[]>`
      SELECT plan_id FROM plans WHERE plan_id = ${planId}::uuid
    `

    if (!existingPlan || existingPlan.length === 0) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      )
    }

    // Update plan metadata
    const updates = []
    if (name) updates.push(`name = '${name.replace(/'/g, "''")}'`)
    if (description !== undefined) {
      updates.push(`description = ${description ? `'${description.replace(/'/g, "''")}'` : 'NULL'}`)
    }
    if (status) updates.push(`status = '${status}'::plan_status`)
    updates.push(`updated_at = NOW()`)

    await prisma.$queryRawUnsafe(`
      UPDATE plans
      SET ${updates.join(", ")}
      WHERE plan_id = '${planId}'
    `)

    // If content is provided, create a new version
    if (content) {
      // Get current version number
      const currentVersion = await prisma.$queryRaw<any[]>`
        SELECT version_number FROM plan_versions
        WHERE plan_id = ${planId}::uuid AND is_current = true
        LIMIT 1
      `

      let newVersionNumber = "1.0"
      if (currentVersion && currentVersion.length > 0) {
        const [major, minor] = currentVersion[0].version_number.split(".")
        newVersionNumber = `${major}.${parseInt(minor) + 1}`
      }

      // Mark old version as not current
      await prisma.$queryRaw`
        UPDATE plan_versions
        SET is_current = false
        WHERE plan_id = ${planId}::uuid
      `

      // Create new version
      await prisma.$queryRaw`
        INSERT INTO plan_versions (
          plan_id, tenant_id, version_number, content, is_current
        )
        SELECT 
          ${planId}::uuid,
          tenant_id,
          ${newVersionNumber},
          ${JSON.stringify(content)}::jsonb,
          true
        FROM plans
        WHERE plan_id = ${planId}::uuid
      `

      // Update plan's current_version
      await prisma.$queryRaw`
        UPDATE plans
        SET current_version = ${newVersionNumber}
        WHERE plan_id = ${planId}::uuid
      `
    }

    // Fetch updated plan
    const updatedPlan = await prisma.$queryRaw<any[]>`
      SELECT 
        p.*,
        pv.version_id,
        pv.content,
        pv.version_number
      FROM plans p
      LEFT JOIN plan_versions pv ON p.plan_id = pv.plan_id AND pv.is_current = true
      WHERE p.plan_id = ${planId}::uuid
      LIMIT 1
    `

    return NextResponse.json({ plan: updatedPlan[0] })
  } catch (error) {
    console.error("Error updating plan:", error)
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    )
  }
}

// DELETE /api/plans/:id - Delete plan
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const planId = params.id

    // Check if plan exists
    const existingPlan = await prisma.$queryRaw<any[]>`
      SELECT plan_id FROM plans WHERE plan_id = ${planId}::uuid
    `

    if (!existingPlan || existingPlan.length === 0) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      )
    }

    // Delete plan (cascade will delete versions and assignments)
    await prisma.$queryRaw`
      DELETE FROM plans WHERE plan_id = ${planId}::uuid
    `

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting plan:", error)
    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 }
    )
  }
}
