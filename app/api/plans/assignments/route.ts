import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/plans/assignments - Get plan assignments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenant_id")
    const clientId = searchParams.get("client_id")
    const planId = searchParams.get("plan_id")
    const status = searchParams.get("status") || "active"

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      )
    }

    let query = `
      SELECT 
        pa.*,
        p.name as plan_name,
        p.plan_type,
        pv.version_number,
        c.client_code,
        c.first_name || ' ' || c.last_name as client_name,
        tm.first_name || ' ' || tm.last_name as assigned_by_name
      FROM plan_assignments pa
      JOIN plans p ON pa.plan_id = p.plan_id
      JOIN plan_versions pv ON pa.version_id = pv.version_id
      LEFT JOIN clients c ON pa.client_id = c.client_id
      LEFT JOIN team_members tm ON pa.assigned_by = tm.member_id
      WHERE pa.tenant_id = '${tenantId}'
        AND pa.status = '${status}'
    `

    if (clientId) {
      query += ` AND pa.client_id = '${clientId}'`
    }

    if (planId) {
      query += ` AND pa.plan_id = '${planId}'`
    }

    query += ` ORDER BY pa.created_at DESC`

    const assignments = await prisma.$queryRawUnsafe(query)

    return NextResponse.json({ assignments })
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    )
  }
}

// POST /api/plans/assignments - Assign plan to client(s)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tenant_id,
      plan_id,
      version_id,
      client_ids,
      cohort_id,
      assigned_by,
      start_date,
      delivery_channel = "whatsapp",
    } = body

    if (!tenant_id || !plan_id || !version_id || (!client_ids && !cohort_id)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const assignments = []

    // If cohort_id provided, get clients from cohort
    let targetClientIds = client_ids || []
    if (cohort_id) {
      const cohortClients = await prisma.$queryRaw`
        SELECT client_id FROM clients
        WHERE tenant_id = ${tenant_id}::uuid
        -- Apply cohort filters here based on cohort.filters JSONB
      `
      targetClientIds = cohortClients.map((c: any) => c.client_id)
    }

    // Create assignments for each client
    for (const clientId of targetClientIds) {
      const assignment = await prisma.$queryRaw`
        INSERT INTO plan_assignments (
          tenant_id, plan_id, version_id, client_id, cohort_id,
          assigned_by, start_date, delivery_channel, status
        ) VALUES (
          ${tenant_id}::uuid,
          ${plan_id}::uuid,
          ${version_id}::uuid,
          ${clientId}::uuid,
          ${cohort_id ? `${cohort_id}::uuid` : null},
          ${assigned_by ? `${assigned_by}::uuid` : null},
          ${start_date || "NOW()"},
          ${delivery_channel},
          'active'
        )
        RETURNING *
      `

      assignments.push(assignment[0])
    }

    // Trigger auto-delivery workflow for all assignments
    // This runs asynchronously in the background
    if (assignments.length > 0) {
      // Import auto-delivery service
      const { autoDelivery } = await import("@/lib/services/auto-delivery")
      
      // Trigger delivery for each assignment (non-blocking)
      Promise.all(
        assignments.map((a) =>
          autoDelivery.deliverPlan({
            assignmentId: a.assignment_id,
            tenantId: tenant_id,
          })
        )
      ).catch((error) => {
        console.error("Background delivery error:", error)
      })
    }

    return NextResponse.json({ assignments }, { status: 201 })
  } catch (error) {
    console.error("Error creating assignments:", error)
    return NextResponse.json(
      { error: "Failed to create assignments" },
      { status: 500 }
    )
  }
}

// PATCH /api/plans/assignments/[id] - Update assignment
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { assignment_id, status, delivery_status } = body

    if (!assignment_id) {
      return NextResponse.json(
        { error: "assignment_id is required" },
        { status: 400 }
      )
    }

    const updates = []
    if (status) updates.push(`status = '${status}'`)
    if (delivery_status) {
      updates.push(`delivery_status = '${delivery_status}'`)
      if (delivery_status === "delivered") {
        updates.push(`delivered_at = NOW()`)
      }
    }
    updates.push(`updated_at = NOW()`)

    const assignment = await prisma.$queryRawUnsafe(`
      UPDATE plan_assignments
      SET ${updates.join(", ")}
      WHERE assignment_id = '${assignment_id}'
      RETURNING *
    `)

    return NextResponse.json({ assignment: assignment[0] })
  } catch (error) {
    console.error("Error updating assignment:", error)
    return NextResponse.json(
      { error: "Failed to update assignment" },
      { status: 500 }
    )
  }
}
