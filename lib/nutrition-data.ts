import { MealPlan, NutritionTemplate } from "@/types/domain/nutrition"

export const mealPlansData: MealPlan[] = [
  { 
    id: 1,
    name: "High Protein Weight Loss", 
    calories: 1800, 
    clients: 8, 
    type: "Weight Loss",
    protein: 180,
    carbs: 120,
    fats: 60,
    description: "Optimized for fat loss while preserving muscle mass"
  },
  { 
    id: 2,
    name: "Muscle Building 3000", 
    calories: 3000, 
    clients: 12, 
    type: "Muscle Gain",
    protein: 225,
    carbs: 375,
    fats: 83,
    description: "High calorie plan for serious muscle growth"
  },
  { 
    id: 3,
    name: "Balanced Maintenance", 
    calories: 2200, 
    clients: 15, 
    type: "Maintenance",
    protein: 165,
    carbs: 247,
    fats: 73,
    description: "Well-rounded nutrition for maintaining current weight"
  },
  { 
    id: 4,
    name: "Keto Fat Loss", 
    calories: 1600, 
    clients: 6, 
    type: "Weight Loss",
    protein: 120,
    carbs: 40,
    fats: 124,
    description: "Low carb, high fat ketogenic approach"
  },
  { 
    id: 5,
    name: "Vegetarian Athlete", 
    calories: 2800, 
    clients: 4, 
    type: "Performance",
    protein: 140,
    carbs: 420,
    fats: 78,
    description: "Plant-based nutrition for active individuals"
  },
  { 
    id: 6,
    name: "Clean Bulk Plan", 
    calories: 3200, 
    clients: 9, 
    type: "Muscle Gain",
    protein: 240,
    carbs: 400,
    fats: 89,
    description: "Quality calories for lean mass gain"
  },
]

export const nutritionTemplatesData: NutritionTemplate[] = [
  {
    id: 1,
    type: "Balanced Diet",
    description: "A well-rounded diet focusing on balanced macronutrients for overall health.",
    lastUpdated: "2024-11-01",
    status: "Active",
    macros: "30% Protein, 40% Carbs, 30% Fats"
  },
  {
    id: 2,
    type: "High Protein Plan",
    description: "Elevated protein intake for muscle building and recovery.",
    lastUpdated: "2024-10-28",
    status: "Active",
    macros: "40% Protein, 35% Carbs, 25% Fats"
  },
  {
    id: 3,
    type: "Low Carb Diet",
    description: "Reduced carbohydrate intake for fat loss and metabolic health.",
    lastUpdated: "2024-10-20",
    status: "Active",
    macros: "35% Protein, 20% Carbs, 45% Fats"
  },
  {
    id: 4,
    type: "Mediterranean Diet",
    description: "Heart-healthy eating inspired by Mediterranean cuisine.",
    lastUpdated: "2024-10-15",
    status: "Active",
    macros: "25% Protein, 45% Carbs, 30% Fats"
  },
]