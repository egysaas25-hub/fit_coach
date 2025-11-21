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
  Dumbbell,
  FileText,
  Eye,
  Plus,
  X,
  GripVertical,
  Loader2,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PDFExportButton } from "@/components/shared/actions/PDFExportButton"

// Wizard steps
const STEPS = [
  { id: 1, name: "Plan Details", icon: FileText },
  { id: 2, name: "Select Exercises", icon: Dumbbell },
  { id: 3, name: "Review & Publish", icon: Eye },
]

// Form schemas
const step1Schema = z.object({
  plan_name: z.string().min(3, "Plan name must be at least 3 characters"),
  goal: z.string().min(1, "Goal is required"),
  duration_weeks: z.coerce.number().min(1).max(52),
  split_type: z.string().min(1, "Split type is required"),
  description: z.string().optional(),
})

interface Exercise {
  id: string
  name: string
  muscle_group: string
  equipment: string
  sets: number
  reps: string
  rest_seconds: number
  tempo: string
  notes: string
}

export default function EditTrainingPlanPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params.id as string

  const [currentStep, setCurrentStep] = useState(1)
  const [planData, setPlanData] = useState<any>({})
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Step 1 form
  const form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      plan_name: "",
      goal: "",
      duration_weeks: 12,
      split_type: "",
      description: "",
    },
  })

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

        // Pre-populate form with existing data
        const formData = {
          plan_name: plan.name || "",
          goal: plan.content?.goal || "",
          duration_weeks: plan.content?.duration_weeks || 12,
          split_type: plan.content?.split_type || "",
          description: plan.description || "",
        }

        form.reset(formData)
        setPlanData(formData)

        // Pre-populate exercises
        if (plan.content?.exercises && Array.isArray(plan.content.exercises)) {
          setSelectedExercises(plan.content.exercises)
        }
      } catch (error) {
        console.error("Error fetching plan:", error)
        toast.error("Failed to load plan data")
        router.push("/admin/programs/training")
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
    setPlanData({ ...planData, ...data })
    setCurrentStep(2)
  }

  // Add exercise to plan
  const addExercise = () => {
    const newExercise: Exercise = {
      id: `temp-${Date.now()}`,
      name: "",
      muscle_group: "",
      equipment: "",
      sets: 3,
      reps: "10-12",
      rest_seconds: 60,
      tempo: "2-0-2-0",
      notes: "",
    }
    setSelectedExercises([...selectedExercises, newExercise])
  }

  // Remove exercise
  const removeExercise = (id: string) => {
    setSelectedExercises(selectedExercises.filter((ex) => ex.id !== id))
  }

  // Update exercise
  const updateExercise = (id: string, field: string, value: any) => {
    setSelectedExercises(
      selectedExercises.map((ex) =>
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    )
  }

  // Move exercise up/down
  const moveExercise = (index: number, direction: "up" | "down") => {
    const newExercises = [...selectedExercises]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex >= 0 && targetIndex < newExercises.length) {
      ;[newExercises[index], newExercises[targetIndex]] = [
        newExercises[targetIndex],
        newExercises[index],
      ]
      setSelectedExercises(newExercises)
    }
  }

  // Handle final submission
  const handleSubmit = async () => {
    if (selectedExercises.length === 0) {
      toast.error("Please add at least one exercise")
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
            type: "training",
            exercises: selectedExercises.map((ex, index) => ({
              ...ex,
              order_index: index,
            })),
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update plan")
      }

      toast.success("Training plan updated successfully!")
      router.push("/admin/programs/training")
    } catch (error) {
      toast.error("Failed to update training plan")
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
            Edit Training Plan
          </h1>
          <p className="text-muted-foreground">
            Update your workout program
          </p>
        </div>
        <div className="flex gap-2">
          <PDFExportButton
            endpoint="/api/export/plan"
            payload={{ planId, type: "workout" }}
            filename={`workout-plan-${planId}.pdf`}
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
                        <Input placeholder="e.g., Beginner Full Body" {...field} />
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
                          <SelectItem value="strength">Strength</SelectItem>
                          <SelectItem value="endurance">Endurance</SelectItem>
                          <SelectItem value="general_fitness">
                            General Fitness
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration_weeks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (weeks) *</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="52" {...field} />
                      </FormControl>
                      <FormDescription>
                        Recommended: 8-12 weeks
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="split_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Split Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select split" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full_body">Full Body</SelectItem>
                          <SelectItem value="upper_lower">Upper/Lower</SelectItem>
                          <SelectItem value="push_pull_legs">
                            Push/Pull/Legs
                          </SelectItem>
                          <SelectItem value="bro_split">Bro Split</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  Next: Select Exercises
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Step 2: Select Exercises */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Add Exercises</h3>
                <p className="text-sm text-muted-foreground">
                  Build your workout by adding exercises
                </p>
              </div>
              <Button onClick={addExercise}>
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>

            {selectedExercises.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No exercises added yet
                </p>
                <Button onClick={addExercise} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedExercises.map((exercise, index) => (
                  <Card key={exercise.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col gap-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => moveExercise(index, "up")}
                          disabled={index === 0}
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-semibold text-center">
                          {index + 1}
                        </span>
                      </div>

                      <div className="flex-1 grid gap-4 md:grid-cols-6">
                        <div className="md:col-span-2">
                          <Input
                            placeholder="Exercise name"
                            value={exercise.name}
                            onChange={(e) =>
                              updateExercise(exercise.id, "name", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="Sets"
                            value={exercise.sets}
                            onChange={(e) =>
                              updateExercise(
                                exercise.id,
                                "sets",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Reps"
                            value={exercise.reps}
                            onChange={(e) =>
                              updateExercise(exercise.id, "reps", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="Rest (s)"
                            value={exercise.rest_seconds}
                            onChange={(e) =>
                              updateExercise(
                                exercise.id,
                                "rest_seconds",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Tempo"
                            value={exercise.tempo}
                            onChange={(e) =>
                              updateExercise(exercise.id, "tempo", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercise(exercise.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                disabled={selectedExercises.length === 0}
              >
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
            <div className="space-y-4">
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
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-medium">{planData.duration_weeks} weeks</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Split Type</div>
                  <div className="font-medium capitalize">
                    {planData.split_type?.replace("_", " ")}
                  </div>
                </div>
              </div>

              {planData.description && (
                <div>
                  <div className="text-sm text-muted-foreground">Description</div>
                  <div className="text-sm">{planData.description}</div>
                </div>
              )}
            </div>

            {/* Exercises */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                Exercises ({selectedExercises.length})
              </div>
              <div className="space-y-2">
                {selectedExercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="flex items-center gap-4 p-3 border rounded-lg"
                  >
                    <Badge variant="outline">{index + 1}</Badge>
                    <div className="flex-1">
                      <div className="font-medium">{exercise.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} reps • {exercise.rest_seconds}s rest • Tempo: {exercise.tempo}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
