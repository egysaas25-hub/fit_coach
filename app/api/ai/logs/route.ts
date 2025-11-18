import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/ai/logs
 * Log AI generation request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tenant_id,
      generated_by,
      generation_type,
      prompt,
      parameters,
      response,
      tokens_used,
      cost_usd,
      success = true,
      error_message,
    } = body

    await prisma.$executeRaw`
      INSERT INTO ai_generation_logs (
        tenant_id, generated_by, generation_type, prompt,
        parameters, response, tokens_used, cost_usd, success, error_message
      ) VALUES (
        ${tenant_id ? `${tenant_id}::uuid` : null},
        ${generated_by ? `${generated_by}::uuid` : null},
        ${generation_type},
        ${prompt},
        ${JSON.stringify(parameters)}::jsonb,
        ${JSON.stringify(response)}::jsonb,
        ${tokens_used || 0},
        ${cost_usd || 0},
        ${success},
        ${error_message || null}
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging AI generation:", error)
    return NextResponse.json(
      { error: "Failed to log generation" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai/logs
 * Get AI generation logs
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenant_id")
    const generationType = searchParams.get("type")
    const limit = parseInt(searchParams.get("limit") || "50")

    let query = `
      SELECT 
        l.*,
        tm.first_name || ' ' || tm.last_name as generated_by_name
      FROM ai_generation_logs l
      LEFT JOIN team_members tm ON l.generated_by = tm.member_id
      WHERE 1=1
    `

    if (tenantId) {
      query += ` AND l.tenant_id = '${tenantId}'`
    }

    if (generationType) {
      query += ` AND l.generation_type = '${generationType}'`
    }

    query += ` ORDER BY l.created_at DESC LIMIT ${limit}`

    const logs = await prisma.$queryRawUnsafe(query)

    // Calculate totals
    const totals = await prisma.$queryRawUnsafe(`
      SELECT 
        COUNT(*) as total_generations,
        SUM(tokens_used) as total_tokens,
        SUM(cost_usd) as total_cost,
        COUNT(*) FILTER (WHERE success = true) as successful,
        COUNT(*) FILTER (WHERE success = false) as failed
      FROM ai_generation_logs
      WHERE ${tenantId ? `tenant_id = '${tenantId}'` : "1=1"}
        ${generationType ? `AND generation_type = '${generationType}'` : ""}
    `)

    return NextResponse.json({
      logs,
      totals: totals[0],
    })
  } catch (error) {
    console.error("Error fetching AI logs:", error)
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    )
  }
}
