import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/communication/messages - Get messages for a thread
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const threadId = searchParams.get("thread_id")
    const limit = parseInt(searchParams.get("limit") || "50")

    if (!threadId) {
      return NextResponse.json(
        { error: "thread_id is required" },
        { status: 400 }
      )
    }

    const messages = await prisma.$queryRaw`
      SELECT 
        m.*,
        CASE 
          WHEN m.sender_type = 'client' THEN c.first_name || ' ' || c.last_name
          WHEN m.sender_type = 'trainer' THEN tm.first_name || ' ' || tm.last_name
          ELSE 'System'
        END as sender_name,
        CASE
          WHEN m.sender_type = 'trainer' THEN '@' || tm.first_name || ' (' || tm.role || ')'
          ELSE NULL
        END as trainer_tag,
        (
          SELECT COUNT(*)
          FROM message_annotations ma
          WHERE ma.message_id = m.message_id
        ) as annotation_count,
        (
          SELECT COUNT(*)
          FROM message_flags mf
          WHERE mf.message_id = m.message_id AND mf.is_resolved = false
        ) as flag_count
      FROM messages m
      LEFT JOIN clients c ON m.sender_id = c.client_id AND m.sender_type = 'client'
      LEFT JOIN team_members tm ON m.sender_id = tm.member_id AND m.sender_type = 'trainer'
      WHERE m.thread_id = ${threadId}::uuid
      ORDER BY m.sent_at ASC
      LIMIT ${limit}
    `

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

// POST /api/communication/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tenant_id,
      thread_id,
      sender_type,
      sender_id,
      content,
      content_type = "text",
      metadata,
    } = body

    if (!tenant_id || !thread_id || !sender_type || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Insert message
    const message = await prisma.$queryRaw`
      INSERT INTO messages (
        tenant_id, thread_id, sender_type, sender_id, content, content_type, metadata
      ) VALUES (
        ${tenant_id}::uuid,
        ${thread_id}::uuid,
        ${sender_type},
        ${sender_id ? `${sender_id}::uuid` : null},
        ${content},
        ${content_type},
        ${metadata ? JSON.stringify(metadata) : null}::jsonb
      )
      RETURNING *
    `

    // Update thread last_message
    await prisma.$executeRaw`
      UPDATE message_threads
      SET 
        last_message_at = NOW(),
        last_message_preview = ${content.substring(0, 100)},
        unread_count = CASE 
          WHEN ${sender_type} = 'client' THEN unread_count + 1
          ELSE unread_count
        END
      WHERE thread_id = ${thread_id}::uuid
    `

    // TODO: Send via external channel (WhatsApp, Email, etc.)
    // This would integrate with Respond.io, SMTP, etc.

    return NextResponse.json({ message: message[0] }, { status: 201 })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
