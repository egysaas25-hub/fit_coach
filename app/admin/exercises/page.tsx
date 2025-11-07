"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { AdminSidebar } from "@/components/navigation/admin-sidebar"
import { ExerciseCard } from "@/components/features/exercise-card"

const categories = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio"]

const exercises = [
  {
    id: 1,
    name: "Bench Press",
    category: "Chest",
    difficulty: "Intermediate",
    equipment: "Barbell",
    muscleGroup: "Chest, Triceps",
  },
  {
    id: 2,
    name: "Squats",
    category: "Legs",
    difficulty: "Beginner",
    equipment: "Barbell",
    muscleGroup: "Quads, Glutes",
  },
  {
    id: 3,
    name: "Deadlift",
    category: "Back",
    difficulty: "Advanced",
    equipment: "Barbell",
    muscleGroup: "Back, Hamstrings",
  },
  {
    id: 4,
    name: "Pull-ups",
    category: "Back",
    difficulty: "Intermediate",
    equipment: "Pull-up Bar",
    muscleGroup: "Lats, Biceps",
  },
  {
    id: 5,
    name: "Shoulder Press",
    category: "Shoulders",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    muscleGroup: "Shoulders, Triceps",
  },
  {
    id: 6,
    name: "Bicep Curls",
    category: "Arms",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    muscleGroup: "Biceps",
  },
  {
    id: 7,
    name: "Plank",
    category: "Core",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    muscleGroup: "Core, Abs",
  },
  {
    id: 8,
    name: "Running",
    category: "Cardio",
    difficulty: "Beginner",
    equipment: "None",
    muscleGroup: "Full Body",
  },
]

export default function ExercisesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredExercises = exercises.filter((exercise) => {
    const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#1e1e1e] pb-24">
      <AdminSidebar />
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#1e1e1e] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Exercises</h1>
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#2a2a2a]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="search"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-gray-400"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-[#21ee43] text-black hover:bg-[#21ee43]/90 whitespace-nowrap"
                  : "bg-[#2a2a2a] border-[#3a3a3a] text-white hover:bg-[#3a3a3a] whitespace-nowrap"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Exercise Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {filteredExercises.length} {filteredExercises.length === 1 ? "exercise" : "exercises"} found
          </p>
        </div>

        {/* Exercise List */}
        <div className="space-y-3">
          {filteredExercises.map((exercise) => (
            <Link key={exercise.id} href={`/exercises/${exercise.id}`}>
              <ExerciseCard {...exercise} />
            </Link>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No exercises found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

    </div>
  )
}
