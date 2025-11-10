"use client"

import { useState } from "react"
import { Search } from "lucide-react"

const libraryExercises = [
  { id: 1, name: "Push-Up", category: "Strength", muscle: "Chest", equipment: "Bodyweight", difficulty: "Beginner" },
  {
    id: 2,
    name: "Bench Press",
    category: "Strength",
    muscle: "Chest",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    id: 3,
    name: "Incline Dumbbell Press",
    category: "Strength",
    muscle: "Chest",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
  },
  { id: 4, name: "Pull-Up", category: "Strength", muscle: "Back", equipment: "Bodyweight", difficulty: "Advanced" },
  { id: 5, name: "Deadlift", category: "Strength", muscle: "Back", equipment: "Barbell", difficulty: "Advanced" },
  { id: 6, name: "Squats", category: "Strength", muscle: "Legs", equipment: "Barbell", difficulty: "Intermediate" },
  { id: 7, name: "Leg Press", category: "Strength", muscle: "Legs", equipment: "Machine", difficulty: "Beginner" },
  { id: 8, name: "Running", category: "Cardio", muscle: "Full Body", equipment: "Treadmill", difficulty: "Beginner" },
]

export default function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  const categories = ["All", "Strength", "Cardio", "Flexibility", "Balance"]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

  const filteredExercises = libraryExercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || exercise.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">Exercise Library</h1>
        <p className="text-secondary">Pre-built exercises with filters and video previews</p>
      </div>

      {/* Search & Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Search</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background text-foreground placeholder-secondary px-4 py-2 pl-10 rounded-lg border border-border focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary transition-colors"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="card rounded-lg overflow-hidden hover:border-primary transition-all group"
          >
            {/* Placeholder for video */}
            <div className="w-full h-40 bg-background flex items-center justify-center text-4xl">🎥</div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-poppins font-bold text-foreground mb-2">{exercise.name}</h3>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-secondary">
                  <strong>Muscle:</strong> {exercise.muscle}
                </p>
                <p className="text-sm text-secondary">
                  <strong>Equipment:</strong> {exercise.equipment}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    exercise.difficulty === "Beginner"
                      ? "bg-green-500 bg-opacity-20 text-green-400"
                      : exercise.difficulty === "Intermediate"
                        ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                        : "bg-red-500 bg-opacity-20 text-red-400"
                  }`}
                >
                  {exercise.difficulty}
                </span>
                <button className="text-primary hover:text-primary hover:opacity-80 transition-opacity font-semibold text-sm">
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12 card rounded-lg">
          <p className="text-secondary mb-2">No exercises found</p>
          <p className="text-sm text-secondary">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
