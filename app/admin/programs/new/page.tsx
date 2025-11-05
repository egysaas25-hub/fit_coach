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

export default function CreateProgramPage() {
  const router = useRouter()
  const [programName, setProgramName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("")
  const [goal, setGoal] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [weeks, setWeeks] = useState([
    { id: 1, name: "Week 1", days: [{ id: 1, name: "Day 1 - Upper Body", exercises: [] }] },
  ])

  const addWeek = () => {
    setWeeks([
      ...weeks,
      {
        id: weeks.length + 1,
        name: `Week ${weeks.length + 1}`,
        days: [{ id: 1, name: `Day 1`, exercises: [] }],
      },
    ])
  }

  const addDay = (weekIndex: number) => {
    const newWeeks = [...weeks]
    const dayCount = newWeeks[weekIndex].days.length
    newWeeks[weekIndex].days.push({
      id: dayCount + 1,
      name: `Day ${dayCount + 1}`,
      exercises: [],
    })
    setWeeks(newWeeks)
  }

  const addExercise = (weekIndex: number, dayIndex: number) => {
    const newWeeks = [...weeks]
    newWeeks[weekIndex].days[dayIndex].exercises.push({
      id: Date.now(),
      name: "",
      sets: "3",
      reps: "10",
      rest: "60",
      notes: "",
    })
    setWeeks(newWeeks)
  }

  const removeExercise = (weekIndex: number, dayIndex: number, exerciseIndex: number) => {
    const newWeeks = [...weeks]
    newWeeks[weekIndex].days[dayIndex].exercises.splice(exerciseIndex, 1)
    setWeeks(newWeeks)
  }

  const updateExercise = (weekIndex: number, dayIndex: number, exerciseIndex: number, field: string, value: string) => {
    const newWeeks = [...weeks]
    newWeeks[weekIndex].days[dayIndex].exercises[exerciseIndex][field] = value
    setWeeks(newWeeks)
  }

  const handleAIGenerate = () => {
    toast.success("AI is generating your program...", {
      description: "This will take a few seconds",
    })
    // Mock AI generation
    setTimeout(() => {
      toast.success("Program generated successfully!")
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Program created successfully!", {
      description: `${programName} has been added to your programs`,
    })
    setTimeout(() => router.push("/admin/programs"), 1000)
  }

  return (
    <div className="flex max-h-screen">
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-heading">Create Training Program</h1>
          <p className="text-muted-foreground mt-2">Build a comprehensive workout program for your clients</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Program Details</CardTitle>
            <CardDescription>Basic information about the training program</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Program Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Beginner Strength Training"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="8"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the program goals and approach..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="goal">Primary Goal *</Label>
                <Select value={goal} onValueChange={setGoal} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Build Strength</SelectItem>
                    <SelectItem value="hypertrophy">Muscle Growth</SelectItem>
                    <SelectItem value="fat-loss">Fat Loss</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="athletic">Athletic Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select value={difficulty} onValueChange={setDifficulty} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
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
                <CardTitle>Program Structure</CardTitle>
                <CardDescription>Add weeks, days, and exercises to your program</CardDescription>
              </div>
              <Button type="button" onClick={addWeek} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Week
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="week-0" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                {weeks.map((week, index) => (
                  <TabsTrigger key={week.id} value={`week-${index}`}>
                    {week.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {weeks.map((week, weekIndex) => (
                <TabsContent key={week.id} value={`week-${weekIndex}`} className="space-y-4 mt-4">
                  {week.days.map((day, dayIndex) => (
                    <Card key={day.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{day.name}</CardTitle>
                          <Button type="button" size="sm" onClick={() => addExercise(weekIndex, dayIndex)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Exercise
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {day.exercises.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No exercises added yet. Click "Add Exercise" to get started.
                          </p>
                        ) : (
                          day.exercises.map((exercise, exerciseIndex) => (
                            <div
                              key={exercise.id}
                              className="grid gap-4 md:grid-cols-6 items-end p-4 border border-border rounded-lg"
                            >
                              <div className="md:col-span-2 space-y-2">
                                <Label>Exercise Name</Label>
                                <Input
                                  placeholder="e.g., Barbell Squat"
                                  value={exercise.name}
                                  onChange={(e) =>
                                    updateExercise(weekIndex, dayIndex, exerciseIndex, "name", e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Sets</Label>
                                <Input
                                  type="number"
                                  placeholder="3"
                                  value={exercise.sets}
                                  onChange={(e) =>
                                    updateExercise(weekIndex, dayIndex, exerciseIndex, "sets", e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Reps</Label>
                                <Input
                                  placeholder="10"
                                  value={exercise.reps}
                                  onChange={(e) =>
                                    updateExercise(weekIndex, dayIndex, exerciseIndex, "reps", e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Rest (sec)</Label>
                                <Input
                                  type="number"
                                  placeholder="60"
                                  value={exercise.rest}
                                  onChange={(e) =>
                                    updateExercise(weekIndex, dayIndex, exerciseIndex, "rest", e.target.value)
                                  }
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeExercise(weekIndex, dayIndex, exerciseIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={() => addDay(weekIndex)} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Day to {week.name}
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Program</Button>
        </div>
      </form>
    </div>
    </div>
  )
}
