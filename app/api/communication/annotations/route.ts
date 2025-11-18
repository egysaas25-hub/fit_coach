import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/communication/annotations - Get annotations for a message
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const messageId = searchParams.get("message_id")

    if (!messageId) {
      return NextResponse.json(
        { error: "message_id is required" },
        { status: 400 }
      )
    }

    const annotations = await prisma.$queryRaw`
      SELECT 
        ma.*,
        tm.first_name || ' ' || tm.last_name as author_name,
        tm.role as author_role
      FROM message_annotations ma
      JOIN team_members tm ON ma.author_id = tm.member_id
      WHERE ma.message_id = ${messageId}::uuid
      ORDER BY ma.created_at ASC
    `

    return NextResponse.json({ annotations })
  } catch (error) {
    console.error("Error fetching annotations:", error)
    return NextResponse.json(
      { error: "Failed to fetch annotations" },
      { status: 500 }
    )
  }
}

// POST /api/communication/annotations - Add internal comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenant_id, message_id, author_id, content, mentions } = body

    if (!tenant_id || !message_id || !author_id || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const annotation = await prisma.$queryRaw`
      INSERT INTO message_annotations (
        tenant_id, message_id, author_id, content, mentions
      ) VALUES (
        ${tenant_id}::uuid,
        ${message_id}::uuid,
        ${author_id}::uuid,
        ${content},
        ${mentions ? JSON.stringify(mentions) : null}::jsonb
      )
      RETURNING *
    `

    // TODO: Send notifications to mentioned team members

    return NextResponse.json({ annotation: annotation[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating annotation:", error)
    return NextResponse.json(
      { error: "Failed to create annotation" },
      { status: 500 }
    )
  }
}
