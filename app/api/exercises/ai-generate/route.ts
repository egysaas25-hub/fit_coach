import { NextRequest, NextResponse } from "next/server"
import { aiExerciseGenerator } from "@/lib/services/ai-exercise-generator"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/exercises/ai-generate
 * Generate exercises using AI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tenant_id,
      generated_by,
      goal,
      body_part,
      equipment,
      experience_level,
      count = 5,
      restrictions,
      preferences,
      save_to_library = false,
    } = body

    if (!tenant_id || !generated_by || !goal || !experience_level) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate experience level
    const validLevels = ["beginner", "intermediate", "advanced", "expert"]
    if (!validLevels.includes(experience_level)) {
      return NextResponse.json(
        { error: "Invalid experience_level" },
        { status: 400 }
      )
    }

    // Generate exercises
    const result = await aiExerciseGenerator.generateExercises({
      goal,
      bodyPart: body_part,
      equipment: equipment || [],
      experienceLevel: experience_level,
      count,
      restrictions: restrictions || [],
      preferences,
    })

    // Log the generation
    await aiExerciseGenerator.logGeneration(
      tenant_id,
      generated_by,
      {
        goal,
        bodyPart: body_part,
        equipment,
        experienceLevel: experience_level,
        count,
        restrictions,
        preferences,
      },
      result,
      true
    )

    // Optionally save to library
    const savedExercises = []
    if (save_to_library) {
      for (const exercise of result.exercises) {
        // Validate exercise
        if (!aiExerciseGenerator.validateExercise(exercise)) {
          console.warn("Skipping invalid exercise:", exercise.name)
          continue
        }

        // Find matching category, body part, equipment
        const category = await findCategory(exercise.bodyPart)
        const bodyPartId = await findBodyPart(exercise.bodyPart)
        const equipmentId = await findEquipment(exercise.equipment)

        // Save to database with pending_review status
        const saved = await prisma.$queryRaw`
          INSERT INTO exercises (
            tenant_id, name, description, instructions,
            category_id, body_part_id, equipment_id,
            difficulty_level, movement_pattern,
            default_sets, default_reps, default_tempo, default_rest_seconds,
            safety_notes, contraindications, variations,
            source, ai_source, ai_prompt, created_by, status
          ) VALUES (
            ${tenant_id}::uuid,
            ${exercise.name},
            ${exercise.description},
            ${exercise.instructions},
            ${category ? `${category}::uuid` : null},
            ${bodyPartId ? `${bodyPartId}::uuid` : null},
            ${equipmentId ? `${equipmentId}::uuid` : null},
            ${exercise.difficultyLevel},
            ${exercise.movementPattern || null},
            ${exercise.defaultSets},
            ${exercise.defaultReps},
            ${exercise.defaultTempo || null},
            ${exercise.defaultRestSeconds},
            ${exercise.safetyNotes || null},
            ${exercise.contraindications ? `ARRAY[${exercise.contraindications.map((c) => `'${c}'`).join(",")}]` : "'{}'"},
            ${exercise.variations ? `ARRAY[${exercise.variations.map((v) => `'${v}'`).join(",")}]` : "'{}'"},
            'ai_generated',
            true,
            ${JSON.stringify({ goal, body_part, equipment, experience_level })},
            ${generated_by}::uuid,
            'pending_review'
          )
          RETURNING *
        `

        const savedExercise = saved[0] as any
        savedExercises.push(savedExercise)

        // Create approval workflow record
        await prisma.approval_workflows.create({
          data: {
            tenant_id: BigInt(tenant_id),
            entity_type: 'exercise',
            entity_id: BigInt(savedExercise.exercise_id),
            status: 'pending',
            submitted_by: BigInt(generated_by),
            metadata: {
              exercise_name: exercise.name,
              ai_prompt: { goal, body_part, equipment, experience_level },
              generated_at: new Date().toISOString(),
            },
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      exercises: result.exercises,
      saved_exercises: savedExercises,
      tokens_used: result.tokensUsed,
      cost_usd: result.costUsd,
      count: result.exercises.length,
    })
  } catch (error) {
    console.error("AI generation error:", error)

    // Log failed generation
    try {
      await aiExerciseGenerator.logGeneration(
        body.tenant_id,
        body.generated_by,
        body,
        { exercises: [], tokensUsed: 0, costUsd: 0 },
        false,
        error instanceof Error ? error.message : "Unknown error"
      )
    } catch (logError) {
      console.error("Failed to log error:", logError)
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI generation failed" },
      { status: 500 }
    )
  }
}

// Helper functions to find IDs
async function findCategory(bodyPart: string): Promise<string | null> {
  const result = await prisma.$queryRaw`
    SELECT category_id FROM exercise_categories
    WHERE LOWER(name) = LOWER(${bodyPart})
    LIMIT 1
  `
  return result[0]?.category_id || null
}

async function findBodyPart(bodyPart: string): Promise<string | null> {
  const result = await prisma.$queryRaw`
    SELECT body_part_id FROM body_parts
    WHERE LOWER(name) = LOWER(${bodyPart})
    LIMIT 1
  `
  return result[0]?.body_part_id || null
}

async function findEquipment(equipment: string): Promise<string | null> {
  const result = await prisma.$queryRaw`
    SELECT equipment_id FROM equipment_types
    WHERE LOWER(name) = LOWER(${equipment})
    LIMIT 1
  `
  return result[0]?.equipment_id || null
}
