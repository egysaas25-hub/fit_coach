import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { pdfGenerator } from "@/lib/services/pdf-generator"

/**
 * POST /api/export/plan
 * Generate a workout or nutrition plan PDF
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { planId, type } = body

    if (!planId) {
      return NextResponse.json(
        { error: "planId is required" },
        { status: 400 }
      )
    }

    if (!type || !["workout", "nutrition"].includes(type)) {
      return NextResponse.json(
        { error: 'type must be either "workout" or "nutrition"' },
        { status: 400 }
      )
    }

    let pdfUrl: string

    if (type === "workout") {
      // Fetch workout/training plan
      const trainingPlan = await prisma.training_plans.findUnique({
        where: { id: BigInt(planId) },
        include: {
          customer: {
            select: {
              first_name: true,
              last_name: true,
              phone_e164: true,
            },
          },
          created_by_team_member: {
            select: {
              full_name: true,
            },
          },
          training_plan_exercises: {
            include: {
              exercise: {
                select: {
                  name: true,
                  description: true,
                  equipment_needed: true,
                },
              },
            },
            orderBy: {
              order_index: "asc",
            },
          },
          tenant: {
            include: {
              tenant_branding: true,
            },
          },
        },
      })

      if (!trainingPlan) {
        return NextResponse.json(
          { error: "Training plan not found" },
          { status: 404 }
        )
      }

      const clientName = `${trainingPlan.customer.first_name || ""} ${trainingPlan.customer.last_name || ""}`.trim() || "Client"
      const clientCode = trainingPlan.customer.phone_e164 || "CLIENT"
      const trainerName = trainingPlan.created_by_team_member.full_name || "Your Coach"

      // Prepare exercises
      const exercises = trainingPlan.training_plan_exercises.map((tpe) => {
        // Parse exercise name from JSON if needed
        let exerciseName = "Exercise"
        if (typeof tpe.exercise.name === "string") {
          exerciseName = tpe.exercise.name
        } else if (typeof tpe.exercise.name === "object" && tpe.exercise.name !== null) {
          // Handle JSON field - try to get English name
          const nameObj = tpe.exercise.name as any
          exerciseName = nameObj.en || nameObj.ar || Object.values(nameObj)[0] || "Exercise"
        }

        return {
          name: exerciseName,
          sets: tpe.sets,
          reps: String(tpe.reps),
          instructions: tpe.exercise.equipment_needed || undefined,
        }
      })

      // Get tenant branding
      const branding = trainingPlan.tenant.tenant_branding?.[0]
      const tenantBranding = branding
        ? {
            logo: branding.logo_url || undefined,
            primaryColor: branding.primary_color || undefined,
            companyName: trainingPlan.tenant.name,
          }
        : undefined

      // Generate workout plan PDF
      pdfUrl = await pdfGenerator.generateWorkoutPlanPDF({
        planId: String(planId),
        planName: `Training Plan v${trainingPlan.version}`,
        description: trainingPlan.split || undefined,
        exercises,
        clientName,
        clientCode,
        trainerName,
        notes: trainingPlan.notes || undefined,
        tenantBranding,
      })
    } else {
      // Fetch nutrition plan
      const nutritionPlan = await prisma.nutrition_plans.findUnique({
        where: { id: BigInt(planId) },
        include: {
          customer: {
            select: {
              first_name: true,
              last_name: true,
              phone_e164: true,
            },
          },
          created_by_team_member: {
            select: {
              full_name: true,
            },
          },
          nutrition_plan_macros: true,
          nutrition_meals: {
            include: {
              nutrition_meal_items: {
                orderBy: {
                  order_index: "asc",
                },
              },
            },
            orderBy: {
              order_index: "asc",
            },
          },
          tenant: {
            include: {
              tenant_branding: true,
            },
          },
        },
      })

      if (!nutritionPlan) {
        return NextResponse.json(
          { error: "Nutrition plan not found" },
          { status: 404 }
        )
      }

      const clientName = `${nutritionPlan.customer.first_name || ""} ${nutritionPlan.customer.last_name || ""}`.trim() || "Client"
      const clientCode = nutritionPlan.customer.phone_e164 || "CLIENT"
      const trainerName = nutritionPlan.created_by_team_member.full_name || "Your Coach"

      // Get macros
      const macros = nutritionPlan.nutrition_plan_macros?.[0]
      const targetCalories = nutritionPlan.calories_target || Number(macros?.calories) || 2000

      const macroData = {
        protein: Number(macros?.protein_g) || 150,
        carbs: Number(macros?.carbs_g) || 200,
        fat: Number(macros?.fat_g) || 60,
      }

      // Prepare meals
      const meals = nutritionPlan.nutrition_meals.map((meal) => {
        const foods = meal.nutrition_meal_items.map((item) => ({
          name: item.food_name,
          quantity: item.portion_size || "1 serving",
          calories: Number(item.calories) || 0,
          protein: Number(item.protein_g) || 0,
          carbs: Number(item.carbs_g) || 0,
          fat: Number(item.fat_g) || 0,
        }))

        const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0)
        const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0)
        const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0)
        const totalFat = foods.reduce((sum, f) => sum + f.fat, 0)

        return {
          name: meal.meal_name,
          time: "Anytime", // Default time since not in schema
          foods,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          instructions: meal.notes || undefined,
        }
      })

      // Get tenant branding
      const branding = nutritionPlan.tenant.tenant_branding?.[0]
      const tenantBranding = branding
        ? {
            logo: branding.logo_url || undefined,
            primaryColor: branding.primary_color || undefined,
            companyName: nutritionPlan.tenant.name,
          }
        : undefined

      // Generate nutrition plan PDF
      pdfUrl = await pdfGenerator.generateNutritionPlanPDF({
        planId: String(planId),
        planName: `Nutrition Plan v${nutritionPlan.version}`,
        targetCalories,
        macros: macroData,
        meals,
        clientName,
        clientCode,
        trainerName,
        notes: nutritionPlan.notes || undefined,
        tenantBranding,
      })
    }

    return NextResponse.json({
      success: true,
      pdfUrl,
      message: `${type === "workout" ? "Workout" : "Nutrition"} plan PDF generated successfully`,
    })
  } catch (error) {
    console.error("Error generating plan PDF:", error)
    return NextResponse.json(
      { error: "Failed to generate plan PDF" },
      { status: 500 }
    )
  }
}
