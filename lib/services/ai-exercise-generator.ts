/**
 * AI Exercise Generator Service
 * Uses OpenAI to generate exercise recommendations
 */

interface GenerateExercisesParams {
  goal: string // e.g., "muscle gain", "fat loss", "strength"
  bodyPart?: string // e.g., "chest", "back", "legs"
  equipment?: string[] // available equipment
  experienceLevel: "beginner" | "intermediate" | "advanced" | "expert"
  count?: number // number of exercises to generate
  restrictions?: string[] // injuries, limitations
  preferences?: string // additional preferences
}

interface GeneratedExercise {
  name: string
  description: string
  instructions: string
  bodyPart: string
  primaryMuscles: string[]
  secondaryMuscles: string[]
  equipment: string
  difficultyLevel: string
  movementPattern: string
  defaultSets: number
  defaultReps: string
  defaultTempo?: string
  defaultRestSeconds: number
  safetyNotes?: string
  contraindications?: string[]
  variations?: string[]
}

interface GenerationResult {
  exercises: GeneratedExercise[]
  tokensUsed: number
  costUsd: number
}

export class AIExerciseGenerator {
  private apiKey: string
  private model: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ""
    this.model = process.env.OPENAI_MODEL || "gpt-4-turbo-preview"
    this.baseUrl = "https://api.openai.com/v1"
  }

  /**
   * Generate exercises using AI
   */
  async generateExercises(params: GenerateExercisesParams): Promise<GenerationResult> {
    const {
      goal,
      bodyPart,
      equipment = [],
      experienceLevel,
      count = 5,
      restrictions = [],
      preferences,
    } = params

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
          max_tokens: 2000,
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

      // Calculate cost (approximate)
      const tokensUsed = data.usage.total_tokens
      const costUsd = this.calculateCost(tokensUsed)

      return {
        exercises: parsed.exercises || [],
        tokensUsed,
        costUsd,
      }
    } catch (error) {
      console.error("AI exercise generation error:", error)
      throw error
    }
  }

  /**
   * Build the prompt for exercise generation
   */
  private buildPrompt(params: GenerateExercisesParams): string {
    const {
      goal,
      bodyPart,
      equipment,
      experienceLevel,
      count,
      restrictions,
      preferences,
    } = params

    let prompt = `Generate ${count} exercise recommendations for:\n\n`
    prompt += `Goal: ${goal}\n`
    
    if (bodyPart) {
      prompt += `Target Body Part: ${bodyPart}\n`
    }
    
    prompt += `Experience Level: ${experienceLevel}\n`
    
    if (equipment && equipment.length > 0) {
      prompt += `Available Equipment: ${equipment.join(", ")}\n`
    } else {
      prompt += `Equipment: Bodyweight only\n`
    }
    
    if (restrictions && restrictions.length > 0) {
      prompt += `Restrictions/Injuries: ${restrictions.join(", ")}\n`
    }
    
    if (preferences) {
      prompt += `Additional Preferences: ${preferences}\n`
    }

    prompt += `\nProvide exercises that are:\n`
    prompt += `- Safe and effective for the experience level\n`
    prompt += `- Appropriate for the available equipment\n`
    prompt += `- Aligned with the stated goal\n`
    prompt += `- Include proper form instructions\n`
    prompt += `- Include safety considerations\n`

    return prompt
  }

  /**
   * System prompt for consistent formatting
   */
  private getSystemPrompt(): string {
    return `You are an expert fitness coach and exercise physiologist. Generate exercise recommendations in JSON format with the following structure:

{
  "exercises": [
    {
      "name": "Exercise name",
      "description": "Brief description of the exercise",
      "instructions": "Step-by-step instructions for proper form",
      "bodyPart": "Primary body part targeted",
      "primaryMuscles": ["muscle1", "muscle2"],
      "secondaryMuscles": ["muscle3"],
      "equipment": "Required equipment",
      "difficultyLevel": "beginner|intermediate|advanced|expert",
      "movementPattern": "push|pull|squat|hinge|carry|rotation",
      "defaultSets": 3,
      "defaultReps": "8-12",
      "defaultTempo": "3-1-1-0",
      "defaultRestSeconds": 60,
      "safetyNotes": "Important safety considerations",
      "contraindications": ["condition1", "condition2"],
      "variations": ["easier variation", "harder variation"]
    }
  ]
}

Guidelines:
- Provide scientifically accurate information
- Include proper form cues
- Consider safety for the experience level
- Suggest appropriate rep ranges and rest periods
- Include tempo notation (eccentric-pause-concentric-pause)
- List any contraindications or safety concerns
- Suggest variations for progression/regression`
  }

  /**
   * Calculate approximate cost based on tokens
   */
  private calculateCost(tokens: number): number {
    // GPT-4 Turbo pricing (approximate)
    // Input: $0.01 per 1K tokens
    // Output: $0.03 per 1K tokens
    // Average: $0.02 per 1K tokens
    return (tokens / 1000) * 0.02
  }

  /**
   * Validate generated exercise
   */
  validateExercise(exercise: GeneratedExercise): boolean {
    const required = [
      "name",
      "description",
      "instructions",
      "bodyPart",
      "equipment",
      "difficultyLevel",
    ]

    for (const field of required) {
      if (!exercise[field as keyof GeneratedExercise]) {
        console.error(`Missing required field: ${field}`)
        return false
      }
    }

    // Validate difficulty level
    const validDifficulties = ["beginner", "intermediate", "advanced", "expert"]
    if (!validDifficulties.includes(exercise.difficultyLevel)) {
      console.error(`Invalid difficulty level: ${exercise.difficultyLevel}`)
      return false
    }

    // Validate sets and reps
    if (exercise.defaultSets < 1 || exercise.defaultSets > 10) {
      console.error(`Invalid sets: ${exercise.defaultSets}`)
      return false
    }

    return true
  }

  /**
   * Log generation for tracking and billing
   */
  async logGeneration(
    tenantId: string,
    generatedBy: string,
    params: GenerateExercisesParams,
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
          generation_type: "exercise",
          prompt: JSON.stringify(params),
          parameters: params,
          response: result.exercises,
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
export const aiExerciseGenerator = new AIExerciseGenerator()
