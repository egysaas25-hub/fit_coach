import { useState, useMemo } from "react"
import { MealPlan, NutritionTemplate } from "@/types/nutrition"
import { mealPlansData, nutritionTemplatesData } from "@/lib/nutrition-data"

export function useNutrition() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("plans")

  const filteredPlans = useMemo(() => 
    mealPlansData.filter(plan =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.type.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  )

  const filteredTemplates = useMemo(() =>
    nutritionTemplatesData.filter(template =>
      template.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  )

  const stats = useMemo(() => ({
    totalPlans: mealPlansData.length,
    totalClients: mealPlansData.reduce((sum, plan) => sum + plan.clients, 0),
    avgCalories: Math.round(mealPlansData.reduce((sum, plan) => sum + plan.calories, 0) / mealPlansData.length),
    totalTemplates: nutritionTemplatesData.length
  }), [])

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filteredPlans,
    filteredTemplates,
    stats,
    allPlans: mealPlansData,
    allTemplates: nutritionTemplatesData
  }
}

