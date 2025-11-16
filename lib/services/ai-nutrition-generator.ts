/**
 * AI Nutrition/Meal Generator Service
 * Uses OpenAI to generate meal plans and nutrition recommendations
 */

interface GenerateMealPlanParams {
  clientInfo: {
    name: string
    age?: number
    gender?: string
    weight?: number // kg
    height?: number // cm
    activityLevel?: string
  }
  goal: string // weight loss, muscle gain, maintenance, performance
  totalCalories: number
  macroSplit: {
    proteinPercent: number
    carbsPercent: number
    fatPercent: number
  }
  mealsPerDay: number
  dietaryType: "standard" | "vegetarian" | "vegan" | "keto" | "paleo" | "mediterranean"
  allergies?: string[]
  dislikes?: string[]
  preferences?: string
  duration?: number // days
}

interface GeneratedMeal {
  mealType: string // breakfast, lunch, dinner, snack
  time: string
  name: string
  description: string
  foods: GeneratedFood[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  preparationTime: number // minutes
  instructions?: string
}

interface GeneratedFood {
  name: string
  quantity: number
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface GenerationResult {
  meals: GeneratedMeal[]
  dailyTotals: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  weeklyPlan?: GeneratedMeal[][] // array of daily meal arrays
  shoppingList?: string[]
  mealPrepTips?: string[]
  tokensUsed: number
  costUsd: number
}

export class AINutritionGenerator {
  private apiKey: string
  private model: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ""
    this.model = process.env.OPENAI_MODEL || "gpt-4-turbo-preview"
    this.baseUrl = "https://api.openai.com/v1"
  }

  /**
   * Generate meal plan using AI
   */
  async generateMealPlan(params: GenerateMealPlanParams): Promise<GenerationResult> {
    try {
      // Build the prompt
      const prompt = this.buildPrompt(params)

      // Call OpenAI API
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content: this.getSystemPrompt(),
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 3000,
          response_format: { type: "json_object" },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`OpenAI API error: ${error.error?.message || "Unknown error"}`)
      }

      const data = await response.json()

      // Parse the response
      const content = data.choices[0].message.content
      const parsed = JSON.parse(content)

      // Calculate cost
      const tokensUsed = data.usage.total_tokens
      const costUsd = this.calculateCost(tokensUsed)

      // Calculate daily totals
      const dailyTotals = this.calculateDailyTotals(parsed.meals || [])

      return {
        meals: parsed.meals || [],
        dailyTotals,
        weeklyPlan: parsed.weeklyPlan,
        shoppingList: parsed.shoppingList,
        mealPrepTips: parsed.mealPrepTips,
        tokensUsed,
        costUsd,
      }
    } catch (error) {
      console.error("AI nutrition generation error:", error)
      throw error
    }
  }

  /**
   * Build the prompt for meal plan generation
   */
  private buildPrompt(params: GenerateMealPlanParams): string {
    const {
      clientInfo,
      goal,
      totalCalories,
      macroSplit,
      mealsPerDay,
      dietaryType,
      allergies,
      dislikes,
      preferences,
      duration,
    } = params

    let prompt = `Create a detailed meal plan for:\n\n`
    
    prompt += `Client: ${clientInfo.name}\n`
    if (clientInfo.age) prompt += `Age: ${clientInfo.age}\n`
    if (clientInfo.gender) prompt += `Gender: ${clientInfo.gender}\n`
    if (clientInfo.weight) prompt += `Weight: ${clientInfo.weight}kg\n`
    if (clientInfo.height) prompt += `Height: ${clientInfo.height}cm\n`
    if (clientInfo.activityLevel) prompt += `Activity Level: ${clientInfo.activityLevel}\n`
    
    prompt += `\nGoal: ${goal}\n`
    prompt += `Total Daily Calories: ${totalCalories}\n`
    prompt += `Macro Split: ${macroSplit.proteinPercent}% protein, ${macroSplit.carbsPercent}% carbs, ${macroSplit.fatPercent}% fat\n`
    prompt += `Meals Per Day: ${mealsPerDay}\n`
    prompt += `Dietary Type: ${dietaryType}\n`
    
    if (allergies && allergies.length > 0) {
      prompt += `Allergies: ${allergies.join(", ")}\n`
    }
    
    if (dislikes && dislikes.length > 0) {
      prompt += `Dislikes: ${dislikes.join(", ")}\n`
    }
    
    if (preferences) {
      prompt += `Preferences: ${preferences}\n`
    }
    
    if (duration) {
      prompt += `Duration: ${duration} days\n`
    }

    prompt += `\nRequirements:\n`
    prompt += `- Hit the calorie and macro targets as closely as possible\n`
    prompt += `- Provide variety and balanced nutrition\n`
    prompt += `- Include realistic portion sizes\n`
    prompt += `- Consider meal timing and energy needs\n`
    prompt += `- Provide practical, easy-to-prepare meals\n`
    prompt += `- Include preparation instructions\n`

    return prompt
  }

  /**
   * System prompt for consistent formatting
   */
  private getSystemPrompt(): string {
    return `You are an expert nutritionist and meal planner. Generate meal plans in JSON format with the following structure:

{
  "meals": [
    {
      "mealType": "breakfast|lunch|dinner|snack",
      "time": "07:00",
      "name": "Meal name",
      "description": "Brief description",
      "foods": [
        {
          "name": "Food name",
          "quantity": 100,
          "unit": "g|ml|piece|cup|tbsp",
          "calories": 200,
          "protein": 20,
          "carbs": 30,
          "fat": 5
        }
      ],
      "totalCalories": 500,
      "totalProtein": 30,
      "totalCarbs": 50,
      "totalFat": 15,
      "preparationTime": 15,
      "instructions": "Step-by-step preparation"
    }
  ],
  "shoppingList": ["ingredient 1", "ingredient 2"],
  "mealPrepTips": ["tip 1", "tip 2"]
}

Guidelines:
- Provide nutritionally accurate information
- Use realistic portion sizes
- Include variety of foods
- Consider meal timing (lighter breakfast, bigger lunch/dinner)
- Ensure macros add up correctly (protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g)
- Include preparation time estimates
- Provide practical cooking instructions
- Consider food combinations and satiety
- Include hydration recommendations`
  }

  /**
   * Calculate daily totals from meals
   */
  private calculateDailyTotals(meals: GeneratedMeal[]) {
    return meals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.totalCalories,
        protein: totals.protein + meal.totalProtein,
        carbs: totals.carbs + meal.totalCarbs,
        fat: totals.fat + meal.totalFat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  }

  /**
   * Calculate approximate cost based on tokens
   */
  private calculateCost(tokens: number): number {
    // GPT-4 Turbo pricing (approximate)
    return (tokens / 1000) * 0.02
  }

  /**
   * Validate generated meal plan
   */
  validateMealPlan(result: GenerationResult, targetCalories: number): boolean {
    const { dailyTotals } = result

    // Check if within 10% of target
    const calorieVariance = Math.abs(dailyTotals.calories - targetCalories) / targetCalories
    if (calorieVariance > 0.1) {
      console.warn(`Calorie variance too high: ${(calorieVariance * 100).toFixed(1)}%`)
      return false
    }

    // Check if meals exist
    if (!result.meals || result.meals.length === 0) {
      console.error("No meals generated")
      return false
    }

    // Validate each meal
    for (const meal of result.meals) {
      if (!meal.foods || meal.foods.length === 0) {
        console.error(`Meal ${meal.name} has no foods`)
        return false
      }

      // Check macro calculations
      const calculatedCalories = 
        meal.totalProtein * 4 + 
        meal.totalCarbs * 4 + 
        meal.totalFat * 9

      const variance = Math.abs(calculatedCalories - meal.totalCalories) / meal.totalCalories
      if (variance > 0.05) {
        console.warn(`Meal ${meal.name} has incorrect macro calculations`)
      }
    }

    return true
  }

  /**
   * Log generation for tracking and billing
   */
  async logGeneration(
    tenantId: string,
    generatedBy: string,
    params: GenerateMealPlanParams,
    result: GenerationResult,
    success: boolean,
    error?: string
  ) {
    try {
      await fetch("/api/ai/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenantId,
          generated_by: generatedBy,
          generation_type: "nutrition",
          prompt: JSON.stringify(params),
          parameters: params,
          response: result.meals,
          tokens_used: result.tokensUsed,
          cost_usd: result.costUsd,
          success,
          error_message: error,
        }),
      })
    } catch (err) {
      console.error("Failed to log AI generation:", err)
    }
  }
}

// Singleton instance
export const aiNutritionGenerator = new AINutritionGenerator()
