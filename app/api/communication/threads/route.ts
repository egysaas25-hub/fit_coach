import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/communication/threads - List all threads
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenant_id")
    const channel = searchParams.get("channel")
    const assignedTo = searchParams.get("assigned_to")
    const status = searchParams.get("status") || "active"

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      )
    }

    const where: any = {
      tenant_id: tenantId,
      status,
    }

    if (channel && channel !== "all") {
      where.channel = { channel_type: channel }
    }

    if (assignedTo) {
      where.assigned_to = assignedTo
    }

    const threads = await prisma.$queryRaw`
      SELECT 
        mt.thread_id,
        mt.tenant_id,
        mt.client_id,
        mt.channel_id,
        mt.assigned_to,
        mt.status,
        mt.unread_count,
        mt.last_message_at,
        mt.last_message_preview,
        c.client_code,
        c.first_name || ' ' || c.last_name as client_name,
        ch.channel_type,
        tm.first_name || ' ' || tm.last_name as assigned_trainer_name
      FROM message_threads mt
      JOIN clients c ON mt.client_id = c.client_id
      JOIN channels ch ON mt.channel_id = ch.channel_id
      LEFT JOIN team_members tm ON mt.assigned_to = tm.member_id
      WHERE mt.tenant_id = ${tenantId}::uuid
        AND mt.status = ${status}
        ${channel && channel !== "all" ? `AND ch.channel_type = ${channel}` : ""}
        ${assignedTo ? `AND mt.assigned_to = ${assignedTo}::uuid` : ""}
      ORDER BY mt.last_message_at DESC NULLS LAST
      LIMIT 100
    `

    return NextResponse.json({ threads })
  } catch (error) {
    console.error("Error fetching threads:", error)
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    )
  }
}

// POST /api/communication/threads - Create new thread
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenant_id, client_id, channel_id, assigned_to } = body

    if (!tenant_id || !client_id || !channel_id) {
      return NextResponse.json(
        { error: "tenant_id, client_id, and channel_id are required" },
        { status: 400 }
      )
    }

    const thread = await prisma.$queryRaw`
      INSERT INTO message_threads (
        tenant_id, client_id, channel_id, assigned_to, status
      ) VALUES (
        ${tenant_id}::uuid,
        ${client_id}::uuid,
        ${channel_id}::uuid,
        ${assigned_to ? `${assigned_to}::uuid` : null},
        'active'
      )
      RETURNING *
    `

    return NextResponse.json({ thread: thread[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating thread:", error)
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    )
  }
}
