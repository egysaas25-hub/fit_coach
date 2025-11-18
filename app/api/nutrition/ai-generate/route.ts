import { NextRequest, NextResponse } from "next/server"
import { aiNutritionGenerator } from "@/lib/services/ai-nutrition-generator"

/**
 * POST /api/nutrition/ai-generate
 * Generate meal plan using AI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tenant_id,
      generated_by,
      client_info,
      goal,
      total_calories,
      macro_split,
      meals_per_day = 3,
      dietary_type = "standard",
      allergies,
      dislikes,
      preferences,
      duration = 1,
      save_to_plan = false,
    } = body

    if (!tenant_id || !generated_by || !goal || !total_calories || !macro_split) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate macro split
    const macroSum = macro_split.protein_percent + macro_split.carbs_percent + macro_split.fat_percent
    if (macroSum !== 100) {
      return NextResponse.json(
        { error: "Macro percentages must sum to 100" },
        { status: 400 }
      )
    }

    // Generate meal plan
    const result = await aiNutritionGenerator.generateMealPlan({
      clientInfo: client_info,
      goal,
      totalCalories: total_calories,
      macroSplit: {
        proteinPercent: macro_split.protein_percent,
        carbsPercent: macro_split.carbs_percent,
        fatPercent: macro_split.fat_percent,
      },
      mealsPerDay: meals_per_day,
      dietaryType: dietary_type,
      allergies: allergies || [],
      dislikes: dislikes || [],
      preferences,
      duration,
    })

    // Validate result
    const isValid = aiNutritionGenerator.validateMealPlan(result, total_calories)
    if (!isValid) {
      console.warn("Generated meal plan failed validation")
    }

    // Log the generation
    await aiNutritionGenerator.logGeneration(
      tenant_id,
      generated_by,
      {
        clientInfo: client_info,
        goal,
        totalCalories: total_calories,
        macroSplit: macro_split,
        mealsPerDay: meals_per_day,
        dietaryType: dietary_type,
        allergies,
        dislikes,
        preferences,
        duration,
      },
      result,
      true
    )

    // Optionally save as nutrition plan
    let savedPlan = null
    if (save_to_plan && client_info.client_id) {
      // TODO: Create nutrition plan in database
      // This would create a plan with plan_type='nutrition'
      // and store the meal data in plan_versions.content
    }

    return NextResponse.json({
      success: true,
      meals: result.meals,
      daily_totals: result.dailyTotals,
      weekly_plan: result.weeklyPlan,
      shopping_list: result.shoppingList,
      meal_prep_tips: result.mealPrepTips,
      tokens_used: result.tokensUsed,
      cost_usd: result.costUsd,
      saved_plan: savedPlan,
      validation: {
        is_valid: isValid,
        calorie_target: total_calories,
        calorie_actual: result.dailyTotals.calories,
        variance_percent: ((result.dailyTotals.calories - total_calories) / total_calories * 100).toFixed(1),
      },
    })
  } catch (error) {
    console.error("AI nutrition generation error:", error)

    // Log failed generation
    try {
      await aiNutritionGenerator.logGeneration(
        body.tenant_id,
        body.generated_by,
        body,
        { meals: [], dailyTotals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, tokensUsed: 0, costUsd: 0 },
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
