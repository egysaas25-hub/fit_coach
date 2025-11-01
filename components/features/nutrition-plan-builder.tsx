"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Food {
  name: string
  quantity: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface Meal {
  name: string
  foods: Food[]
}

export function NutritionPlanBuilder() {
  const [meals] = useState<Meal[]>([
    {
      name: "Breakfast",
      foods: [
        { name: "Oats", quantity: "1 cup", calories: 154, protein: 6, carbs: 27, fat: 3 },
        { name: "Banana", quantity: "1 medium", calories: 105, protein: 1, carbs: 27, fat: 0 },
      ],
    },
    {
      name: "Lunch",
      foods: [
        { name: "Grilled Chicken Salad", quantity: "1.5 cups", calories: 350, protein: 35, carbs: 15, fat: 18 },
        { name: "Avocado", quantity: "1/2 fruit", calories: 160, protein: 2, carbs: 9, fat: 15 },
      ],
    },
    {
      name: "Dinner",
      foods: [
        { name: "Salmon", quantity: "6 oz", calories: 350, protein: 40, carbs: 0, fat: 20 },
        { name: "Brown Rice", quantity: "1 cup", calories: 215, protein: 5, carbs: 45, fat: 2 },
      ],
    },
    {
      name: "Snacks",
      foods: [
        { name: "Almonds", quantity: "1 oz", calories: 164, protein: 6, carbs: 6, fat: 14 },
        { name: "Greek Yogurt", quantity: "1 cup", calories: 100, protein: 17, carbs: 6, fat: 0 },
      ],
    },
  ])

  const [mealSummary] = useState([
    { label: "Pre-Game", value: 233 },
    { label: "Breakfast", value: 222 },
    { label: "Calories", value: 455 },
    { label: "Protein (g)", value: 12 },
    { label: "Carbs (g)", value: 54 },
    { label: "Fat (g)", value: 9 },
  ])

  const totalCalories = meals.reduce((sum, meal) => sum + meal.foods.reduce((s, f) => s + f.calories, 0), 0)
  const totalProtein = meals.reduce((sum, meal) => sum + meal.foods.reduce((s, f) => s + f.protein, 0), 0)
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.foods.reduce((s, f) => s + f.carbs, 0), 0)
  const totalFat = meals.reduce((sum, meal) => sum + meal.foods.reduce((s, f) => s + f.fat, 0), 0)

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <div className="w-64">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Meals</h3>
                <div className="space-y-2">
                  {["Meal 1", "Meal 2", "Meal 3", "Meal 4"].map((meal, index) => (
                    <button
                      key={meal}
                      className="w-full text-left px-3 py-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                    >
                      <div className="text-sm font-medium">{meal}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Summary</h3>
                <div className="space-y-2">
                  {mealSummary.map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Nutrition Plan Builder</h1>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-6 pr-4">
            {meals.map((meal, mealIndex) => (
              <Card key={mealIndex} className="bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      Meal {mealIndex + 1}: {meal.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Food</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Calories</TableHead>
                        <TableHead className="text-right">Protein (g)</TableHead>
                        <TableHead className="text-right">Carbs (g)</TableHead>
                        <TableHead className="text-right">Fat (g)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {meal.foods.map((food, foodIndex) => (
                        <TableRow key={foodIndex}>
                          <TableCell className="font-medium">{food.name}</TableCell>
                          <TableCell>{food.quantity}</TableCell>
                          <TableCell className="text-right">{food.calories}</TableCell>
                          <TableCell className="text-right">{food.protein}</TableCell>
                          <TableCell className="text-right">{food.carbs}</TableCell>
                          <TableCell className="text-right">{food.fat}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button variant="outline" className="mt-4 gap-2 bg-transparent">
                    <Plus className="h-4 w-4" />
                    Add Food
                  </Button>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-card border-primary">
              <CardHeader>
                <CardTitle className="text-xl">Total Daily Intake</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Protein (g)</div>
                    <div className="text-2xl font-bold">{Math.round(totalProtein)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Calories</div>
                    <div className="text-2xl font-bold">{Math.round(totalCalories)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Carbs (g)</div>
                    <div className="text-2xl font-bold">{Math.round(totalCarbs)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Fat (g)</div>
                    <div className="text-2xl font-bold">{Math.round(totalFat)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button size="lg" className="gap-2">
                Save Plan
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
