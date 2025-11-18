import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/clients/social-handles - Get social handles for a client
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get("client_id")
    const tenantId = searchParams.get("tenant_id")
    const platform = searchParams.get("platform")

    if (!clientId && !tenantId) {
      return NextResponse.json(
        { error: "client_id or tenant_id is required" },
        { status: 400 }
      )
    }

    let query = `SELECT * FROM client_social_handles WHERE 1=1`

    if (clientId) {
      query += ` AND client_id = '${clientId}'`
    }

    if (tenantId) {
      query += ` AND tenant_id = '${tenantId}'`
    }

    if (platform) {
      query += ` AND platform = '${platform}'`
    }

    query += ` ORDER BY created_at DESC`

    const handles = await prisma.$queryRawUnsafe(query)

    return NextResponse.json({ handles })
  } catch (error) {
    console.error("Error fetching social handles:", error)
    return NextResponse.json(
      { error: "Failed to fetch social handles" },
      { status: 500 }
    )
  }
}

// POST /api/clients/social-handles - Add social handle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenant_id, client_id, platform, handle } = body

    if (!tenant_id || !client_id || !platform || !handle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const validPlatforms = ["instagram", "facebook", "telegram", "signal", "tiktok"]
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform" },
        { status: 400 }
      )
    }

    const socialHandle = await prisma.$queryRaw`
      INSERT INTO client_social_handles (
        tenant_id, client_id, platform, handle
      ) VALUES (
        ${tenant_id}::uuid,
        ${client_id}::uuid,
        ${platform},
        ${handle}
      )
      ON CONFLICT (tenant_id, platform, handle) DO UPDATE
      SET client_id = ${client_id}::uuid, updated_at = NOW()
      RETURNING *
    `

    return NextResponse.json({ handle: socialHandle[0] }, { status: 201 })
  } catch (error) {
    console.error("Error adding social handle:", error)
    return NextResponse.json(
      { error: "Failed to add social handle" },
      { status: 500 }
    )
  }
}

// PATCH /api/clients/social-handles/verify - Verify social handle
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { handle_id } = body

    if (!handle_id) {
      return NextResponse.json(
        { error: "handle_id is required" },
        { status: 400 }
      )
    }

    const handle = await prisma.$queryRaw`
      UPDATE client_social_handles
      SET 
        is_verified = true,
        verified_at = NOW(),
        updated_at = NOW()
      WHERE handle_id = ${handle_id}::uuid
      RETURNING *
    `

    return NextResponse.json({ handle: handle[0] })
  } catch (error) {
    console.error("Error verifying handle:", error)
    return NextResponse.json(
      { error: "Failed to verify handle" },
      { status: 500 }
    )
  }
}
