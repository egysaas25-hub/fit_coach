"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"

const customExercises = [
  {
    id: 1,
    name: "Modified Push-Up",
    description: "Wall-assisted push-up",
    videoThumbnail: "🎥",
    sets: 3,
    reps: 10,
    created: "2025-01-15",
  },
  {
    id: 2,
    name: "Resistance Band Rows",
    description: "Using resistance band",
    videoThumbnail: "🎥",
    sets: 4,
    reps: 12,
    created: "2025-01-10",
  },
  {
    id: 3,
    name: "Knee Taps",
    description: "Core engagement exercise",
    videoThumbnail: "🎥",
    sets: 3,
    reps: 15,
    created: "2025-01-08",
  },
]

export default function CustomExercises() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">Custom Exercises</h1>
          <p className="text-muted-foreground">Manage user-created workouts with video uploads</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Create Exercise
        </button>
      </div>

      {/* Custom Exercises Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Description</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Video</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Sets x Reps</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Created</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customExercises.map((exercise) => (
                <tr key={exercise.id} className="border-b border-border hover:bg-accent transition-colors">
                  <td className="px-6 py-3 text-foreground font-medium">{exercise.name}</td>
                  <td className="px-6 py-3 text-muted-foreground">{exercise.description}</td>
                  <td className="px-6 py-3 text-2xl">{exercise.videoThumbnail}</td>
                  <td className="px-6 py-3 text-foreground">
                    {exercise.sets} x {exercise.reps}
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{exercise.created}</td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <button className="text-primary hover:opacity-80 transition-opacity inline-flex items-center gap-1">
                      <Edit2 size={16} /> Edit
                    </button>
                    <button className="text-destructive hover:opacity-80 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-poppins font-bold text-foreground mb-4">Create Custom Exercise</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Exercise Name</label>
                <input
                  type="text"
                  placeholder="Enter name..."
                  className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
                <textarea
                  placeholder="Describe the exercise..."
                  className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary resize-none h-24"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Sets</label>
                  <input
                    type="number"
                    placeholder="3"
                    className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Reps</label>
                  <input
                    type="number"
                    placeholder="10"
                    className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="30s"
                    className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Upload Video</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <p className="text-2xl mb-2">📹</p>
                  <p className="text-sm text-muted-foreground">Click or drag video here</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button className="flex-1 btn-primary">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
