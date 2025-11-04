"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, ArrowLeft, Sparkles } from "lucide-react"
import { toast } from "sonner"

export default function CreateNutritionPage() {
  const router = useRouter()
  const [planName, setPlanName] = useState("")
  const [description, setDescription] = useState("")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [fats, setFats] = useState("")
  const [dietType, setDietType] = useState("")
  const [meals, setMeals] = useState([
    { id: 1, name: "Breakfast", time: "08:00", foods: [] },
    { id: 2, name: "Lunch", time: "13:00", foods: [] },
    { id: 3, name: "Dinner", time: "19:00", foods: [] },
  ])

  const addMeal = () => {
    setMeals([
      ...meals,
      {
        id: meals.length + 1,
        name: `Meal ${meals.length + 1}`,
        time: "12:00",
        foods: [],
      },
    ])
  }

  const addFood = (mealIndex: number) => {
    const newMeals = [...meals]
    newMeals[mealIndex].foods.push({
      id: Date.now(),
      name: "",
      quantity: "",
      unit: "g",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
    })
    setMeals(newMeals)
  }

  const removeFood = (mealIndex: number, foodIndex: number) => {
    const newMeals = [...meals]
    newMeals[mealIndex].foods.splice(foodIndex, 1)
    setMeals(newMeals)
  }

  const updateFood = (mealIndex: number, foodIndex: number, field: string, value: string) => {
    const newMeals = [...meals]
    newMeals[mealIndex].foods[foodIndex][field] = value
    setMeals(newMeals)
  }

  const updateMeal = (mealIndex: number, field: string, value: string) => {
    const newMeals = [...meals]
    newMeals[mealIndex][field] = value
    setMeals(newMeals)
  }

  const handleAIGenerate = () => {
    toast.success("AI is generating your nutrition plan...", {
      description: "This will take a few seconds",
    })
    // Mock AI generation
    setTimeout(() => {
      toast.success("Nutrition plan generated successfully!")
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Nutrition plan created successfully!", {
      description: `${planName} has been added to your plans`,
    })
    setTimeout(() => router.push("/admin/nutrition"), 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-heading">Create Nutrition Plan</h1>
          <p className="text-muted-foreground mt-2">Build a comprehensive meal plan for your clients</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>Basic information about the nutrition plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., High Protein Meal Plan"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dietType">Diet Type *</Label>
                <Select value={dietType} onValueChange={setDietType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select diet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="high-protein">High Protein</SelectItem>
                    <SelectItem value="low-carb">Low Carb</SelectItem>
                    <SelectItem value="keto">Ketogenic</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the nutrition plan goals and approach..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Daily Calories *</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="2400"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g) *</Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="180"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g) *</Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="250"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fats">Fats (g) *</Label>
                <Input
                  id="fats"
                  type="number"
                  placeholder="70"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="button" variant="outline" onClick={handleAIGenerate} className="w-full bg-transparent">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate with AI
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daily Meals</CardTitle>
                <CardDescription>Add meals and foods to your nutrition plan</CardDescription>
              </div>
              <Button type="button" onClick={addMeal} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Meal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="meal-0" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                {meals.map((meal, index) => (
                  <TabsTrigger key={meal.id} value={`meal-${index}`}>
                    {meal.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {meals.map((meal, mealIndex) => (
                <TabsContent key={meal.id} value={`meal-${mealIndex}`} className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Meal Name</Label>
                              <Input
                                value={meal.name}
                                onChange={(e) => updateMeal(mealIndex, "name", e.target.value)}
                                placeholder="e.g., Breakfast"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Time</Label>
                              <Input
                                type="time"
                                value={meal.time}
                                onChange={(e) => updateMeal(mealIndex, "time", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Foods</Label>
                        <Button type="button" size="sm" onClick={() => addFood(mealIndex)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Food
                        </Button>
                      </div>

                      {meal.foods.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No foods added yet. Click "Add Food" to get started.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {meal.foods.map((food, foodIndex) => (
                            <div
                              key={food.id}
                              className="grid gap-4 md:grid-cols-8 items-end p-4 border border-border rounded-lg"
                            >
                              <div className="md:col-span-2 space-y-2">
                                <Label>Food Name</Label>
                                <Input
                                  placeholder="e.g., Chicken Breast"
                                  value={food.name}
                                  onChange={(e) => updateFood(mealIndex, foodIndex, "name", e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  placeholder="200"
                                  value={food.quantity}
                                  onChange={(e) => updateFood(mealIndex, foodIndex, "quantity", e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Unit</Label>
                                <Select
                                  value={food.unit}
                                  onValueChange={(value) => updateFood(mealIndex, foodIndex, "unit", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="g">g</SelectItem>
                                    <SelectItem value="oz">oz</SelectItem>
                                    <SelectItem value="cup">cup</SelectItem>
                                    <SelectItem value="tbsp">tbsp</SelectItem>
                                    <SelectItem value="piece">piece</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Calories</Label>
                                <Input
                                  type="number"
                                  placeholder="300"
                                  value={food.calories}
                                  onChange={(e) => updateFood(mealIndex, foodIndex, "calories", e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Protein</Label>
                                <Input
                                  type="number"
                                  placeholder="40"
                                  value={food.protein}
                                  onChange={(e) => updateFood(mealIndex, foodIndex, "protein", e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Carbs</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={food.carbs}
                                  onChange={(e) => updateFood(mealIndex, foodIndex, "carbs", e.target.value)}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFood(mealIndex, foodIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Nutrition Plan</Button>
        </div>
      </form>
    </div>
  )
}
