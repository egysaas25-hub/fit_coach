import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/nutrition/foods - List foods
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenant_id")
    const source = searchParams.get("source") // usda, custom, ai_generated, all
    const category = searchParams.get("category")
    const dietary = searchParams.get("dietary") // vegetarian, vegan, keto, etc.
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "50")

    let query = `
      SELECT 
        f.*,
        fc.name as category_name
      FROM foods f
      LEFT JOIN food_categories fc ON f.category_id = fc.category_id
      WHERE f.is_active = true
    `

    // Source filter
    if (source && source !== "all") {
      query += ` AND f.source = '${source}'`
    }

    // Tenant filter (USDA foods visible to all)
    if (tenantId) {
      query += ` AND (f.tenant_id = '${tenantId}' OR f.source = 'usda')`
    }

    // Category filter
    if (category) {
      query += ` AND f.category_id = '${category}'`
    }

    // Dietary filter
    if (dietary) {
      switch (dietary) {
        case "vegetarian":
          query += ` AND f.is_vegetarian = true`
          break
        case "vegan":
          query += ` AND f.is_vegan = true`
          break
        case "keto":
          query += ` AND f.is_keto_friendly = true`
          break
        case "gluten_free":
          query += ` AND f.is_gluten_free = true`
          break
        case "dairy_free":
          query += ` AND f.is_dairy_free = true`
          break
      }
    }

    // Search filter
    if (search) {
      query += ` AND (
        f.name ILIKE '%${search}%' OR
        f.brand ILIKE '%${search}%'
      )`
    }

    query += ` ORDER BY f.name ASC LIMIT ${limit}`

    const foods = await prisma.$queryRawUnsafe(query)

    return NextResponse.json({ foods })
  } catch (error) {
    console.error("Error fetching foods:", error)
    return NextResponse.json(
      { error: "Failed to fetch foods" },
      { status: 500 }
    )
  }
}

// POST /api/nutrition/foods - Create food
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tenant_id,
      name,
      brand,
      category_id,
      serving_size,
      serving_unit = "g",
      calories,
      protein,
      carbs,
      fat,
      fiber = 0,
      sugar = 0,
      sodium = 0,
      vitamins,
      minerals,
      source,
      external_id,
      is_vegetarian = false,
      is_vegan = false,
      is_gluten_free = false,
      is_dairy_free = false,
      is_keto_friendly = false,
      allergens,
      created_by,
    } = body

    if (!name || !serving_size || !calories || !protein || !carbs || !fat || !source) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const food = await prisma.$queryRaw`
      INSERT INTO foods (
        tenant_id, name, brand, category_id,
        serving_size, serving_unit,
        calories, protein, carbs, fat, fiber, sugar, sodium,
        vitamins, minerals,
        source, external_id,
        is_vegetarian, is_vegan, is_gluten_free, is_dairy_free, is_keto_friendly,
        allergens, created_by, status
      ) VALUES (
        ${tenant_id ? `${tenant_id}::uuid` : null},
        ${name},
        ${brand || null},
        ${category_id ? `${category_id}::uuid` : null},
        ${serving_size},
        ${serving_unit},
        ${calories},
        ${protein},
        ${carbs},
        ${fat},
        ${fiber},
        ${sugar},
        ${sodium},
        ${vitamins ? JSON.stringify(vitamins) : null}::jsonb,
        ${minerals ? JSON.stringify(minerals) : null}::jsonb,
        ${source},
        ${external_id || null},
        ${is_vegetarian},
        ${is_vegan},
        ${is_gluten_free},
        ${is_dairy_free},
        ${is_keto_friendly},
        ${allergens ? `ARRAY[${allergens.map((a: string) => `'${a}'`).join(",")}]` : "'{}'"},
        ${created_by ? `${created_by}::uuid` : null},
        'approved'
      )
      RETURNING *
    `

    return NextResponse.json({ food: food[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating food:", error)
    return NextResponse.json(
      { error: "Failed to create food" },
      { status: 500 }
    )
  }
}
