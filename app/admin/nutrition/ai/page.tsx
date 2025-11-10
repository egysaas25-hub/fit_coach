"use client"

import { useState } from "react"
import { Wand2 } from "lucide-react"

const mealStructure = [
  { meal: "Breakfast", time: "8:00 AM", suggestions: ["Oats with Berries", "Eggs & Toast", "Greek Yogurt"] },
  { meal: "Mid-Morning", time: "10:30 AM", suggestions: ["Protein Shake", "Apple & Almonds", "Cottage Cheese"] },
  { meal: "Lunch", time: "1:00 PM", suggestions: ["Chicken & Rice", "Salmon & Broccoli", "Turkey Sandwich"] },
  { meal: "Pre-Workout", time: "3:30 PM", suggestions: ["Banana & PB", "Rice Cakes & Honey", "Dates"] },
  { meal: "Dinner", time: "7:00 PM", suggestions: ["Beef & Potatoes", "Fish & Veggies", "Pasta & Sauce"] },
]

export default function AIMealBuilder() {
  const [calorieTarget, setCalorieTarget] = useState(2500)
  const [preferences, setPreferences] = useState("none")
  const [generated, setGenerated] = useState(false)

  const handleGenerate = () => {
    setGenerated(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">AI Meal Builder</h1>
        <p className="text-muted-foreground">Input calorie target, auto-generate meal plan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Form */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-6">
            <h2 className="text-lg font-poppins font-bold text-foreground mb-4">Build Plan</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Daily Calorie Target</label>
                <input
                  type="number"
                  value={calorieTarget}
                  onChange={(e) => setCalorieTarget(Number.parseInt(e.target.value))}
                  min="1200"
                  max="5000"
                  className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
                />
                <input
                  type="range"
                  value={calorieTarget}
                  onChange={(e) => setCalorieTarget(Number.parseInt(e.target.value))}
                  min="1200"
                  max="5000"
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Dietary Preference</label>
                <select
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
                >
                  <option value="none">No Restriction</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Wand2 size={18} />
                Generate Meal Plan
              </button>
            </div>
          </div>
        </div>

        {/* Generated Plan */}
        <div className="lg:col-span-2">
          {generated ? (
            <div className="space-y-4">
              <div className="card p-6 mb-6">
                <h2 className="text-lg font-poppins font-bold text-foreground mb-2">Daily Meal Plan</h2>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Daily Calories</p>
                    <p className="text-2xl font-bold text-primary">{calorieTarget}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Protein</p>
                    <p className="text-2xl font-bold text-primary">{Math.round((calorieTarget * 0.3) / 4)}g</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Carbs</p>
                    <p className="text-2xl font-bold text-primary">{Math.round((calorieTarget * 0.45) / 4)}g</p>
                  </div>
                </div>
              </div>

              {mealStructure.map((mealPlan, idx) => (
                <div key={idx} className="card p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-poppins font-bold text-foreground">{mealPlan.meal}</h3>
                      <p className="text-sm text-muted-foreground">{mealPlan.time}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {mealPlan.suggestions.map((suggestion, sidx) => (
                      <div key={sidx} className="flex items-center justify-between bg-muted p-3 rounded">
                        <span className="text-foreground text-sm">{suggestion}</span>
                        <button className="text-primary hover:opacity-80 transition-opacity">+ Add</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-3">
                <button className="flex-1 btn-primary">
                  Save as Template
                </button>
                <button
                  onClick={() => setGenerated(false)}
                  className="flex-1 btn-secondary"
                >
                  Generate New
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-muted-foreground">
                Configure calorie target and preferences to generate a personalized meal plan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
