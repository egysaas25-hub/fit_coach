"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  UtensilsCrossed,
  FileText,
  Eye,
  Plus,
  X,
  AlertCircle,
  Loader2,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PDFExportButton } from "@/components/shared/actions/PDFExportButton"

// Wizard steps
const STEPS = [
  { id: 1, name: "Plan Details", icon: FileText },
  { id: 2, name: "Build Meals", icon: UtensilsCrossed },
  { id: 3, name: "Review & Publish", icon: Eye },
]

// Form schemas
const step1Schema = z.object({
  plan_name: z.string().min(3, "Plan name must be at least 3 characters"),
  goal: z.string().min(1, "Goal is required"),
  calories_target: z.coerce.number().min(1000).max(5000),
  protein_percent: z.coerce.number().min(10).max(50),
  carbs_percent: z.coerce.number().min(20).max(70),
  fat_percent: z.coerce.number().min(15).max(50),
  description: z.string().optional(),
}).refine(
  (data) => data.protein_percent + data.carbs_percent + data.fat_percent === 100,
  {
    message: "Macro percentages must sum to 100%",
    path: ["protein_percent"],
  }
)

interface FoodItem {
  id: string
  food_name: string
  portion_size: number
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface Meal {
  id: string
  meal_name: string
  foods: FoodItem[]
}

export default function EditNutritionPlanPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params.id as string

  const [currentStep, setCurrentStep] = useState(1)
  const [planData, setPlanData] = useState<any>({})
  const [meals, setMeals] = useState<Meal[]>([
    { id: "meal-1", meal_name: "Breakfast", foods: [] },
    { id: "meal-2", meal_name: "Lunch", foods: [] },
    { id: "meal-3", meal_name: "Dinner", foods: [] },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Step 1 form
  const form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      plan_name: "",
      goal: "",
      calories_target: 2000,
      protein_percent: 30,
      carbs_percent: 40,
      fat_percent: 30,
      description: "",
    },
  })

  // Calculate macro grams from percentages
  const calculateMacros = (calories: number, proteinPct: number, carbsPct: number, fatPct: number) => {
    return {
      protein: Math.round((calories * proteinPct / 100) / 4),
      carbs: Math.round((calories * carbsPct / 100) / 4),
      fat: Math.round((calories * fatPct / 100) / 9),
    }
  }

  // Fetch existing plan data
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/plans/${planId}`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch plan")
        }

        const data = await response.json()
        const plan = data.plan

        // Extract content from plan
        const content = plan.content || {}
        
        // Calculate percentages from grams if available
        const calories = content.calories_target || 2000
        const proteinGrams = content.protein || 0
        const carbsGrams = content.carbs || 0
        const fatGrams = content.fat || 0
        
        // Calculate percentages (reverse calculation)
        const proteinPercent = proteinGrams > 0 ? Math.round((proteinGrams * 4 * 100) / calories) : 30
        const carbsPercent = carbsGrams > 0 ? Math.round((carbsGrams * 4 * 100) / calories) : 40
        const fatPercent = fatGrams > 0 ? Math.round((fatGrams * 9 * 100) / calories) : 30

        // Pre-populate form with existing data
        const formData = {
          plan_name: plan.name || "",
          goal: content.goal || "",
          calories_target: calories,
          protein_percent: proteinPercent,
          carbs_percent: carbsPercent,
          fat_percent: fatPercent,
          description: plan.description || "",
        }

        form.reset(formData)
        
        // Calculate macros for planData
        const macros = calculateMacros(calories, proteinPercent, carbsPercent, fatPercent)
        setPlanData({ ...formData, ...macros })

        // Pre-populate meals if available
        if (content.meals && Array.isArray(content.meals) && content.meals.length > 0) {
          setMeals(content.meals.map((meal: any) => ({
            id: meal.id || `meal-${Date.now()}-${Math.random()}`,
            meal_name: meal.meal_name || meal.name || "Meal",
            foods: (meal.foods || []).map((food: any) => ({
              id: food.id || `food-${Date.now()}-${Math.random()}`,
              food_name: food.food_name || "",
              portion_size: food.portion_size || 100,
              unit: food.unit || "g",
              calories: food.calories || 0,
              protein: food.protein || 0,
              carbs: food.carbs || 0,
              fat: food.fat || 0,
            })),
          })))
        }
      } catch (error) {
        console.error("Error fetching plan:", error)
        toast.error("Failed to load plan data")
        router.push("/admin/nutrition")
      } finally {
        setIsLoading(false)
      }
    }

    if (planId) {
      fetchPlan()
    }
  }, [planId, form, router])

  // Handle step 1 submission
  const onStep1Submit = (data: z.infer<typeof step1Schema>) => {
    const macros = calculateMacros(
      data.calories_target,
      data.protein_percent,
      data.carbs_percent,
      data.fat_percent
    )
    setPlanData({ ...data, ...macros })
    setCurrentStep(2)
  }

  // Add meal
  const addMeal = () => {
    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      meal_name: `Meal ${meals.length + 1}`,
      foods: [],
    }
    setMeals([...meals, newMeal])
  }

  // Remove meal
  const removeMeal = (id: string) => {
    if (meals.length <= 1) {
      toast.error("Plan must have at least one meal")
      return
    }
    setMeals(meals.filter((m) => m.id !== id))
  }

  // Update meal name
  const updateMealName = (id: string, name: string) => {
    setMeals(meals.map((m) => (m.id === id ? { ...m, meal_name: name } : m)))
  }

  // Add food to meal
  const addFoodToMeal = (mealId: string) => {
    const newFood: FoodItem = {
      id: `food-${Date.now()}`,
      food_name: "",
      portion_size: 100,
      unit: "g",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
    setMeals(
      meals.map((m) =>
        m.id === mealId ? { ...m, foods: [...m.foods, newFood] } : m
      )
    )
  }

  // Remove food from meal
  const removeFoodFromMeal = (mealId: string, foodId: string) => {
    setMeals(
      meals.map((m) =>
        m.id === mealId
          ? { ...m, foods: m.foods.filter((f) => f.id !== foodId) }
          : m
      )
    )
  }

  // Update food
  const updateFood = (mealId: string, foodId: string, field: string, value: any) => {
    setMeals(
      meals.map((m) =>
        m.id === mealId
          ? {
              ...m,
              foods: m.foods.map((f) =>
                f.id === foodId ? { ...f, [field]: value } : f
              ),
            }
          : m
      )
    )
  }

  // Calculate totals
  const calculateTotals = () => {
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0

    meals.forEach((meal) => {
      meal.foods.forEach((food) => {
        totalCalories += food.calories
        totalProtein += food.protein
        totalCarbs += food.carbs
        totalFat += food.fat
      })
    })

    return { totalCalories, totalProtein, totalCarbs, totalFat }
  }

  const totals = calculateTotals()
  const caloriesDiff = totals.totalCalories - (planData.calories_target || 0)
  const proteinDiff = totals.totalProtein - (planData.protein || 0)
  const carbsDiff = totals.totalCarbs - (planData.carbs || 0)
  const fatDiff = totals.totalFat - (planData.fat || 0)

  // Handle final submission
  const handleSubmit = async () => {
    const totalFoods = meals.reduce((sum, meal) => sum + meal.foods.length, 0)
    if (totalFoods === 0) {
      toast.error("Please add at least one food item")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: planData.plan_name,
          description: planData.description,
          content: {
            ...planData,
            type: "nutrition",
            meals: meals.map((meal, index) => ({
              ...meal,
              order_index: index,
            })),
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update plan")
      }

      toast.success("Nutrition plan updated successfully!")
      router.push("/admin/nutrition")
    } catch (error) {
      toast.error("Failed to update nutrition plan")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Nutrition Plan
          </h1>
          <p className="text-muted-foreground">
            Update your meal plan
          </p>
        </div>
        <div className="flex gap-2">
          <PDFExportButton
            endpoint="/api/export/plan"
            payload={{ planId, type: "nutrition" }}
            filename={`nutrition-plan-${planId}.pdf`}
            label="Export as PDF"
            variant="outline"
          />
          <Button variant="outline" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      {/* Wizard Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    currentStep > step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "border-primary text-primary"
                      : "border-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{step.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Step {step.id} of {STEPS.length}
                  </div>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-0.5 flex-1 transition-colors",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <Card className="p-6">
        {/* Step 1: Plan Details */}
        {currentStep === 1 && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onStep1Submit)}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="plan_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., High Protein Diet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                          <SelectItem value="fat_loss">Fat Loss</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="calories_target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Calories *</FormLabel>
                      <FormControl>
                        <Input type="number" min="1000" max="5000" {...field} />
                      </FormControl>
                      <FormDescription>Target daily calorie intake</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>Macro Split *</FormLabel>
                <div className="grid gap-4 md:grid-cols-3 mt-2">
                  <FormField
                    control={form.control}
                    name="protein_percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Protein %</FormLabel>
                        <FormControl>
                          <Input type="number" min="10" max="50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="carbs_percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Carbs %</FormLabel>
                        <FormControl>
                          <Input type="number" min="20" max="70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fat_percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Fat %</FormLabel>
                        <FormControl>
                          <Input type="number" min="15" max="50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Total: {form.watch("protein_percent") + form.watch("carbs_percent") + form.watch("fat_percent")}% (must equal 100%)
                </p>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add notes about this plan..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">
                  Next: Build Meals
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Step 2: Build Meals */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Build Your Meals</h3>
                <p className="text-sm text-muted-foreground">
                  Add foods to each meal to reach your macro targets
                </p>
              </div>
              <Button onClick={addMeal} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Meal
              </Button>
            </div>

            {/* Macro Targets */}
            <Card className="p-4 bg-muted/50">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{planData.calories_target}</div>
                  <div className="text-xs text-muted-foreground">Calories Target</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{planData.protein}g</div>
                  <div className="text-xs text-muted-foreground">Protein Target</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{planData.carbs}g</div>
                  <div className="text-xs text-muted-foreground">Carbs Target</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{planData.fat}g</div>
                  <div className="text-xs text-muted-foreground">Fat Target</div>
                </div>
              </div>
            </Card>

            {/* Current Totals */}
            <Card className="p-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className={cn(
                    "text-2xl font-bold",
                    Math.abs(caloriesDiff) > 100 ? "text-yellow-500" : "text-green-500"
                  )}>
                    {totals.totalCalories}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current ({caloriesDiff > 0 ? "+" : ""}{caloriesDiff})
                  </div>
                </div>
                <div>
                  <div className={cn(
                    "text-2xl font-bold",
                    Math.abs(proteinDiff) > 10 ? "text-yellow-500" : "text-green-500"
                  )}>
                    {totals.totalProtein}g
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current ({proteinDiff > 0 ? "+" : ""}{proteinDiff}g)
                  </div>
                </div>
                <div>
                  <div className={cn(
                    "text-2xl font-bold",
                    Math.abs(carbsDiff) > 10 ? "text-yellow-500" : "text-green-500"
                  )}>
                    {totals.totalCarbs}g
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current ({carbsDiff > 0 ? "+" : ""}{carbsDiff}g)
                  </div>
                </div>
                <div>
                  <div className={cn(
                    "text-2xl font-bold",
                    Math.abs(fatDiff) > 10 ? "text-yellow-500" : "text-green-500"
                  )}>
                    {totals.totalFat}g
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current ({fatDiff > 0 ? "+" : ""}{fatDiff}g)
                  </div>
                </div>
              </div>
            </Card>

            {/* Meals */}
            <div className="space-y-4">
              {meals.map((meal) => (
                <Card key={meal.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Input
                      value={meal.meal_name}
                      onChange={(e) => updateMealName(meal.id, e.target.value)}
                      className="max-w-xs font-semibold"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addFoodToMeal(meal.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Food
                      </Button>
                      {meals.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMeal(meal.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {meal.foods.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <p className="text-sm text-muted-foreground">No foods added</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {meal.foods.map((food) => (
                        <div key={food.id} className="flex items-center gap-2">
                          <Input
                            placeholder="Food name"
                            value={food.food_name}
                            onChange={(e) =>
                              updateFood(meal.id, food.id, "food_name", e.target.value)
                            }
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            placeholder="Portion"
                            value={food.portion_size}
                            onChange={(e) =>
                              updateFood(meal.id, food.id, "portion_size", parseFloat(e.target.value))
                            }
                            className="w-24"
                          />
                          <Select
                            value={food.unit}
                            onValueChange={(value) =>
                              updateFood(meal.id, food.id, "unit", value)
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="g">g</SelectItem>
                              <SelectItem value="oz">oz</SelectItem>
                              <SelectItem value="cup">cup</SelectItem>
                              <SelectItem value="tbsp">tbsp</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFoodFromMeal(meal.id, food.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)}>
                Next: Review
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Publish */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review Your Plan</h3>
            </div>

            {/* Plan Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-muted-foreground">Plan Name</div>
                <div className="font-medium">{planData.plan_name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Goal</div>
                <div className="font-medium capitalize">
                  {planData.goal?.replace("_", " ")}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Daily Calories</div>
                <div className="font-medium">{planData.calories_target} kcal</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Macro Split</div>
                <div className="font-medium">
                  P: {planData.protein}g | C: {planData.carbs}g | F: {planData.fat}g
                </div>
              </div>
            </div>

            {/* Meals Summary */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                Meals ({meals.length})
              </div>
              <div className="space-y-2">
                {meals.map((meal) => (
                  <div key={meal.id} className="p-3 border rounded-lg">
                    <div className="font-medium mb-2">{meal.meal_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {meal.foods.length} food items
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Macro Accuracy Warning */}
            {(Math.abs(caloriesDiff) > 100 || Math.abs(proteinDiff) > 10) && (
              <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-500">
                      Macro targets not met
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Your current meal plan is {Math.abs(caloriesDiff)} calories{" "}
                      {caloriesDiff > 0 ? "over" : "under"} target. Consider adjusting
                      portion sizes.
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    Update Plan
                    <Check className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
