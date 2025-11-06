"use client"

import type React from "react"
import { useState } from "react"
import { Plus, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const exerciseLibrary = [
  { id: "squat", name: "Squats", category: "Lower Body" },
  { id: "deadlift", name: "Deadlifts", category: "Lower Body" },
  { id: "bench", name: "Bench Press", category: "Upper Body" },
  { id: "lunge", name: "Lunges", category: "Lower Body" },
  { id: "yoga", name: "Yoga", category: "Flexibility" },
  { id: "pilates", name: "Pilates", category: "Core" },
  { id: "aerobics", name: "Aerobics", category: "Cardio" },
]

interface Exercise {
  id: string
  name: string
  category: string
}

interface DayPlan {
  day: number
  exercises: Exercise[]
}

export function WorkoutPlanBuilder() {
  const [draggedExercise, setDraggedExercise] = useState<Exercise | null>(null)
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([
    { day: 1, exercises: [] },
    { day: 2, exercises: [] },
    { day: 3, exercises: [] },
  ])

  const handleDragStart = (exercise: Exercise) => {
    setDraggedExercise(exercise)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (dayIndex: number) => {
    if (draggedExercise) {
      setDayPlans((prev) =>
        prev.map((plan, index) =>
          index === dayIndex ? { ...plan, exercises: [...plan.exercises, draggedExercise] } : plan,
        ),
      )
      setDraggedExercise(null)
    }
  }

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    setDayPlans((prev) =>
      prev.map((plan, index) =>
        index === dayIndex
          ? {
              ...plan,
              exercises: plan.exercises.filter((_, i) => i !== exerciseIndex),
            }
          : plan,
      ),
    )
  }

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar */}
      <div className="w-64 space-y-6">
        <Card className="bg-card">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Workout Plan Builder</h2>
            <p className="text-sm text-muted-foreground mb-4">A plan focused on building strength in the upper body</p>
            <Button variant="outline" className="w-full text-sm bg-transparent">
              Upper Body Strength
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card flex-1">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Exercise Library</h3>
            <ScrollArea className="h-full min-h-[300px] max-h-[calc(100vh-20rem)]">
              <div className="space-y-2">
                {exerciseLibrary.map((exercise) => (
                  <div
                    key={exercise.id}
                    draggable
                    onDragStart={() => handleDragStart(exercise)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-accent hover:bg-accent/80 cursor-move transition-colors"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{exercise.name}</div>
                      <div className="text-xs text-muted-foreground">{exercise.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Drag & Drop Workout Plan</h1>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Plan
          </Button>
        </div>

        <div className="space-y-4">
          {dayPlans.map((plan, dayIndex) => (
            <Card
              key={plan.day}
              className="border-2 border-dashed border-border hover:border-primary/50 transition-colors"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(dayIndex)}
            >
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Day {plan.day}</h2>

                {plan.exercises.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-medium mb-1">Drag exercises here</h3>
                    <p className="text-sm text-muted-foreground">
                      Add exercises from the library to build your workout plan.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {plan.exercises.map((exercise, exerciseIndex) => (
                      <div
                        key={`${exercise.id}-${exerciseIndex}`}
                        className="flex items-center gap-3 p-3 rounded-lg bg-accent"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-sm text-muted-foreground">{exercise.category}</div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeExercise(dayIndex, exerciseIndex)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}