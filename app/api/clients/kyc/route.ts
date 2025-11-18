import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/clients/kyc - Get KYC data for a client
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get("client_id")
    const tenantId = searchParams.get("tenant_id")
    const status = searchParams.get("status")

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      )
    }

    let query = `
      SELECT 
        ck.*,
        c.client_code,
        c.first_name || ' ' || c.last_name as client_name,
        tm.first_name || ' ' || tm.last_name as verified_by_name
      FROM client_kyc ck
      JOIN clients c ON ck.client_id = c.client_id
      LEFT JOIN team_members tm ON ck.verified_by = tm.member_id
      WHERE ck.tenant_id = '${tenantId}'
    `

    if (clientId) {
      query += ` AND ck.client_id = '${clientId}'`
    }

    if (status) {
      query += ` AND ck.status = '${status}'`
    }

    query += ` ORDER BY ck.created_at DESC`

    const kycRecords = await prisma.$queryRawUnsafe(query)

    return NextResponse.json({ kyc: kycRecords })
  } catch (error) {
    console.error("Error fetching KYC:", error)
    return NextResponse.json(
      { error: "Failed to fetch KYC data" },
      { status: 500 }
    )
  }
}

// POST /api/clients/kyc - Submit KYC data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenant_id, client_id, data, consent_given } = body

    if (!tenant_id || !client_id || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const kyc = await prisma.$queryRaw`
      INSERT INTO client_kyc (
        tenant_id, client_id, data, consent_given, consent_timestamp, status, submitted_at
      ) VALUES (
        ${tenant_id}::uuid,
        ${client_id}::uuid,
        ${JSON.stringify(data)}::jsonb,
        ${consent_given},
        ${consent_given ? "NOW()" : null},
        'submitted',
        NOW()
      )
      ON CONFLICT (client_id) DO UPDATE
      SET 
        data = ${JSON.stringify(data)}::jsonb,
        consent_given = ${consent_given},
        consent_timestamp = ${consent_given ? "NOW()" : null},
        status = 'submitted',
        submitted_at = NOW(),
        updated_at = NOW()
      RETURNING *
    `

    return NextResponse.json({ kyc: kyc[0] }, { status: 201 })
  } catch (error) {
    console.error("Error submitting KYC:", error)
    return NextResponse.json(
      { error: "Failed to submit KYC data" },
      { status: 500 }
    )
  }
}

// PATCH /api/clients/kyc/verify - Verify KYC
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { client_id, verified_by, status, rejection_reason } = body

    if (!client_id || !verified_by || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const validStatuses = ["verified", "rejected"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const kyc = await prisma.$queryRaw`
      UPDATE client_kyc
      SET 
        status = ${status},
        verified_by = ${verified_by}::uuid,
        verified_at = NOW(),
        rejection_reason = ${rejection_reason || null},
        updated_at = NOW()
      WHERE client_id = ${client_id}::uuid
      RETURNING *
    `

    // If verified, create persistent notification for "Client ready for plans"
    if (status === "verified") {
      await prisma.$executeRaw`
        INSERT INTO persistent_notifications (
          tenant_id,
          notification_type,
          title,
          message,
          action_url,
          action_label,
          related_entity_type,
          related_entity_id,
          priority
        )
        SELECT 
          c.tenant_id,
          'kyc_ready',
          'Client Ready for Plans',
          'KYC verified for ' || c.first_name || ' ' || c.last_name || ' (' || c.client_code || '). Assign training and nutrition plans.',
          '/admin/clients/' || c.client_id,
          'Assign Plans',
          'client',
          c.client_id,
          'high'
        FROM clients c
        WHERE c.client_id = ${client_id}::uuid
      `
    }

    return NextResponse.json({ kyc: kyc[0] })
  } catch (error) {
    console.error("Error verifying KYC:", error)
    return NextResponse.json(
      { error: "Failed to verify KYC" },
      { status: 500 }
    )
  }
}
