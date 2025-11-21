import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/exercises - List exercises
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenant_id")
    const source = searchParams.get("source") // global, custom, ai_generated, all
    const status = searchParams.get("status") || "approved"
    const category = searchParams.get("category")
    const bodyPart = searchParams.get("body_part")
    const equipment = searchParams.get("equipment")
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "50")

    let query = `
      SELECT 
        e.*,
        ec.name as category_name,
        bp.name as body_part_name,
        eq.name as equipment_name,
        tm.first_name || ' ' || tm.last_name as created_by_name,
        (
          SELECT AVG(rating)::DECIMAL(3,2)
          FROM exercise_ratings er
          WHERE er.exercise_id = e.exercise_id
        ) as avg_rating,
        (
          SELECT COUNT(*)
          FROM exercise_ratings er
          WHERE er.exercise_id = e.exercise_id
        ) as rating_count
      FROM exercises e
      LEFT JOIN exercise_categories ec ON e.category_id = ec.category_id
      LEFT JOIN body_parts bp ON e.body_part_id = bp.body_part_id
      LEFT JOIN equipment_types eq ON e.equipment_id = eq.equipment_id
      LEFT JOIN team_members tm ON e.created_by = tm.member_id
      WHERE 1=1
    `

    // Source filter
    if (source && source !== "all") {
      query += ` AND e.source = '${source}'`
    }

    // Tenant filter (global exercises visible to all)
    if (tenantId) {
      query += ` AND (e.tenant_id = '${tenantId}' OR e.source = 'global')`
    }

    // Status filter - prevent AI-generated content from being used until approved
    if (status !== "all") {
      query += ` AND e.status = '${status}'`
    } else {
      // When showing all, exclude pending_review AI-generated exercises
      query += ` AND NOT (e.source = 'ai_generated' AND e.status = 'pending_review')`
    }

    // Category filter
    if (category) {
      query += ` AND e.category_id = '${category}'`
    }

    // Body part filter
    if (bodyPart) {
      query += ` AND e.body_part_id = '${bodyPart}'`
    }

    // Equipment filter
    if (equipment) {
      query += ` AND e.equipment_id = '${equipment}'`
    }

    // Search filter
    if (search) {
      query += ` AND (
        e.name ILIKE '%${search}%' OR
        e.description ILIKE '%${search}%' OR
        '${search}' = ANY(e.aliases)
      )`
    }

    query += ` ORDER BY e.name ASC LIMIT ${limit}`

    const exercises = await prisma.$queryRawUnsafe(query)

    return NextResponse.json({ exercises })
  } catch (error) {
    console.error("Error fetching exercises:", error)
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    )
  }
}

// POST /api/exercises - Create exercise
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tenant_id,
      name,
      aliases,
      description,
      instructions,
      category_id,
      body_part_id,
      primary_muscles,
      secondary_muscles,
      equipment_id,
      difficulty_level,
      movement_pattern,
      default_sets,
      default_reps,
      default_tempo,
      default_rest_seconds,
      video_url,
      thumbnail_url,
      images,
      safety_notes,
      contraindications,
      variations,
      source,
      ai_source,
      ai_prompt,
      created_by,
    } = body

    if (!name || !source) {
      return NextResponse.json(
        { error: "name and source are required" },
        { status: 400 }
      )
    }

    // Validate source
    const validSources = ["global", "custom", "ai_generated"]
    if (!validSources.includes(source)) {
      return NextResponse.json(
        { error: "Invalid source" },
        { status: 400 }
      )
    }

    // Global exercises require no tenant_id
    if (source === "global" && tenant_id) {
      return NextResponse.json(
        { error: "Global exercises cannot have tenant_id" },
        { status: 400 }
      )
    }

    // Custom/AI exercises require tenant_id
    if (source !== "global" && !tenant_id) {
      return NextResponse.json(
        { error: "tenant_id required for custom/AI exercises" },
        { status: 400 }
      )
    }

    const exercise = await prisma.$queryRaw`
      INSERT INTO exercises (
        tenant_id, name, aliases, description, instructions,
        category_id, body_part_id, primary_muscles, secondary_muscles,
        equipment_id, difficulty_level, movement_pattern,
        default_sets, default_reps, default_tempo, default_rest_seconds,
        video_url, thumbnail_url, images,
        safety_notes, contraindications, variations,
        source, ai_source, ai_prompt, created_by, status
      ) VALUES (
        ${tenant_id ? `${tenant_id}::uuid` : null},
        ${name},
        ${aliases ? `ARRAY[${aliases.map((a: string) => `'${a}'`).join(",")}]` : "'{}'"},
        ${description || null},
        ${instructions || null},
        ${category_id ? `${category_id}::uuid` : null},
        ${body_part_id ? `${body_part_id}::uuid` : null},
        ${primary_muscles ? `ARRAY[${primary_muscles.map((m: string) => `'${m}'::uuid`).join(",")}]` : "'{}'"},
        ${secondary_muscles ? `ARRAY[${secondary_muscles.map((m: string) => `'${m}'::uuid`).join(",")}]` : "'{}'"},
        ${equipment_id ? `${equipment_id}::uuid` : null},
        ${difficulty_level || null},
        ${movement_pattern || null},
        ${default_sets || 3},
        ${default_reps || "8-12"},
        ${default_tempo || null},
        ${default_rest_seconds || 60},
        ${video_url || null},
        ${thumbnail_url || null},
        ${images ? `ARRAY[${images.map((i: string) => `'${i}'`).join(",")}]` : "'{}'"},
        ${safety_notes || null},
        ${contraindications ? `ARRAY[${contraindications.map((c: string) => `'${c}'`).join(",")}]` : "'{}'"},
        ${variations ? `ARRAY[${variations.map((v: string) => `'${v}'`).join(",")}]` : "'{}'"},
        ${source},
        ${ai_source || false},
        ${ai_prompt || null},
        ${created_by ? `${created_by}::uuid` : null},
        ${source === "global" ? "'approved'" : "'draft'"}
      )
      RETURNING *
    `

    return NextResponse.json({ exercise: exercise[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating exercise:", error)
    return NextResponse.json(
      { error: "Failed to create exercise" },
      { status: 500 }
    )
  }
}

// PATCH /api/exercises/[id] - Update exercise
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { exercise_id, ...updates } = body

    if (!exercise_id) {
      return NextResponse.json(
        { error: "exercise_id is required" },
        { status: 400 }
      )
    }

    // Build update query dynamically
    const updateFields = []
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        updateFields.push(`${key} = '${value}'`)
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      )
    }

    updateFields.push("updated_at = NOW()")

    const exercise = await prisma.$queryRawUnsafe(`
      UPDATE exercises
      SET ${updateFields.join(", ")}
      WHERE exercise_id = '${exercise_id}'
      RETURNING *
    `)

    return NextResponse.json({ exercise: exercise[0] })
  } catch (error) {
    console.error("Error updating exercise:", error)
    return NextResponse.json(
      { error: "Failed to update exercise" },
      { status: 500 }
    )
  }
}
