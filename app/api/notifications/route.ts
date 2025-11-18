import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/notifications - Get persistent notifications
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenant_id")
    const recipientId = searchParams.get("recipient_id")
    const isDismissed = searchParams.get("is_dismissed") || "false"
    const notificationType = searchParams.get("type")

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      )
    }

    let query = `
      SELECT * FROM persistent_notifications
      WHERE tenant_id = '${tenantId}'
        AND is_dismissed = ${isDismissed === "true"}
    `

    if (recipientId) {
      query += ` AND (recipient_id = '${recipientId}' OR recipient_id IS NULL)`
    }

    if (notificationType) {
      query += ` AND notification_type = '${notificationType}'`
    }

    query += ` ORDER BY priority DESC, created_at DESC LIMIT 50`

    const notifications = await prisma.$queryRawUnsafe(query)

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tenant_id,
      recipient_id,
      notification_type,
      title,
      message,
      action_url,
      action_label,
      related_entity_type,
      related_entity_id,
      priority = "normal",
    } = body

    if (!tenant_id || !notification_type || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const notification = await prisma.$queryRaw`
      INSERT INTO persistent_notifications (
        tenant_id, recipient_id, notification_type, title, message,
        action_url, action_label, related_entity_type, related_entity_id, priority
      ) VALUES (
        ${tenant_id}::uuid,
        ${recipient_id ? `${recipient_id}::uuid` : null},
        ${notification_type},
        ${title},
        ${message},
        ${action_url || null},
        ${action_label || null},
        ${related_entity_type || null},
        ${related_entity_id ? `${related_entity_id}::uuid` : null},
        ${priority}
      )
      RETURNING *
    `

    return NextResponse.json({ notification: notification[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications/[id] - Mark as read or dismissed
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notification_id, action } = body

    if (!notification_id || !action) {
      return NextResponse.json(
        { error: "notification_id and action are required" },
        { status: 400 }
      )
    }

    let updateQuery = ""
    if (action === "read") {
      updateQuery = `is_read = true, read_at = NOW()`
    } else if (action === "dismiss") {
      updateQuery = `is_dismissed = true, dismissed_at = NOW()`
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'read' or 'dismiss'" },
        { status: 400 }
      )
    }

    const notification = await prisma.$queryRawUnsafe(`
      UPDATE persistent_notifications
      SET ${updateQuery}
      WHERE notification_id = '${notification_id}'
      RETURNING *
    `)

    return NextResponse.json({ notification: notification[0] })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    )
  }
}
