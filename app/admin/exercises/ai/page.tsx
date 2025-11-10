"use client"

import { useState } from "react"
import { Wand2, Plus } from "lucide-react"

const generatedPlans = [
  { id: 1, goal: "Weight Loss", client: "John Doe", exercises: 8, date: "2025-01-20" },
  { id: 2, goal: "Muscle Gain", client: "Jane Smith", exercises: 12, date: "2025-01-18" },
]

const aiGeneratedExercises = [
  { name: "Burpees", sets: 3, reps: "10-12", duration: "45s", intensity: "High" },
  { name: "Jump Squats", sets: 3, reps: "15", duration: "40s", intensity: "High" },
  { name: "Mountain Climbers", sets: 3, reps: "20", duration: "45s", intensity: "Medium" },
  { name: "High Knees", sets: 3, reps: "30", duration: "40s", intensity: "High" },
]

export default function AIExerciseGenerator() {
  const [selectedGoal, setSelectedGoal] = useState("Weight Loss")
  const [selectedClient, setSelectedClient] = useState("John Doe")
  const [duration, setDuration] = useState(12)
  const [generated, setGenerated] = useState(false)

  const goals = ["Weight Loss", "Muscle Gain", "Endurance", "Flexibility", "Core Strength"]
  const clients = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"]

  const handleGenerate = () => {
    setGenerated(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">AI Exercise Generator</h1>
        <p className="text-muted-foreground">Automated exercise plans per client goal using AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Form */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-6">
            <h2 className="text-lg font-poppins font-bold text-foreground mb-4">Generate Plan</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Goal</label>
                <select
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
                >
                  {goals.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Client</label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
                >
                  {clients.map((client) => (
                    <option key={client} value={client}>
                      {client}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Duration (weeks)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number.parseInt(e.target.value))}
                  min="1"
                  max="52"
                  className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
                />
              </div>

              <button
                onClick={handleGenerate}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Wand2 size={18} />
                Generate Plan
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {generated && (
            <>
              <div>
                <h2 className="text-lg font-poppins font-bold text-foreground mb-4">Generated Workout Plan</h2>
                <div className="space-y-3">
                  {aiGeneratedExercises.map((exercise, idx) => (
                    <div
                      key={idx}
                      className="card p-4 hover:border-primary transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-poppins font-bold text-foreground">{exercise.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {exercise.sets} sets x {exercise.reps} reps • {exercise.duration}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                            exercise.intensity === "High"
                              ? "bg-red-500 bg-opacity-20 text-red-400"
                              : exercise.intensity === "Medium"
                                ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                                : "bg-green-500 bg-opacity-20 text-green-400"
                          }`}
                        >
                          {exercise.intensity}
                        </span>
                      </div>
                      <button className="text-primary hover:opacity-80 transition-opacity text-sm font-semibold flex items-center gap-1">
                        <Plus size={14} /> Add to Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 btn-primary">
                  Save as Program
                </button>
                <button
                  onClick={() => setGenerated(false)}
                  className="flex-1 btn-secondary"
                >
                  New Generation
                </button>
              </div>
            </>
          )}

          {!generated && (
            <div className="card p-12 text-center">
              <p className="text-4xl mb-3">🤖</p>
              <p className="text-muted-foreground">
                Configure options and click "Generate Plan" to create an AI-powered workout
              </p>
            </div>
          )}

          {/* History */}
          <div>
            <h3 className="text-lg font-poppins font-bold text-foreground mb-3">Generation History</h3>
            <div className="space-y-2">
              {generatedPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="card p-4 flex justify-between items-center hover:border-primary transition-all"
                >
                  <div>
                    <p className="font-medium text-foreground">{plan.goal}</p>
                    <p className="text-sm text-muted-foreground">
                      {plan.client} • {plan.exercises} exercises
                    </p>
                  </div>
                  <p className="text-sm text-secondary">{plan.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
