"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

import { ExerciseCard } from "@/components/features/exercise-card"
import { useExercises } from '@/lib/hooks/api/useExercises'
import { Exercise } from '@/types/domain/exercise'

// Helper function to convert difficulty to proper case
const formatDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): "Beginner" | "Intermediate" | "Advanced" => {
  const mapping: Record<'beginner' | 'intermediate' | 'advanced', "Beginner" | "Intermediate" | "Advanced"> = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced'
  }
  return mapping[difficulty]
}

export default function ExercisesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const { data: exercises, isLoading, error } = useExercises()

  // Filter exercises based on category and search query
  const filteredExercises = useMemo(() => {
    if (!exercises) return []
    
    return exercises.filter((exercise) => {
      const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [exercises, selectedCategory, searchQuery])

  // Extract unique categories from exercises
  const categories = useMemo(() => {
    if (!exercises) return ["All"]
    
    const uniqueCategories = Array.from(new Set(exercises.map(ex => ex.category)))
    return ["All", ...uniqueCategories]
  }, [exercises])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Error loading exercises</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Exercises</h1>
            <Button variant="ghost" size="icon" className="hover:bg-accent">
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
              className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
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
                  ? "whitespace-nowrap"
                  : "bg-muted border-border text-foreground hover:bg-accent whitespace-nowrap"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Exercise Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {isLoading ? 'Loading...' : `${filteredExercises.length} ${filteredExercises.length === 1 ? "exercise" : "exercises"} found`}
          </p>
        </div>

        {/* Exercise List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExercises.map((exercise) => (
              <Link key={exercise.id} href={`/admin/exercises/${exercise.id}`}>
                <ExerciseCard 
                  name={exercise.name}
                  category={exercise.category}
                  difficulty={formatDifficulty(exercise.difficulty)}
                  equipment={exercise.equipment.join(', ')}
                  muscleGroup={exercise.muscleGroup.join(', ')}
                />
              </Link>
            ))}
          </div>
        )}

        {!isLoading && filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
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