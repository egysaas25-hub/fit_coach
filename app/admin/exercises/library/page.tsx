"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { useExercises } from '@/lib/hooks/api/useExercises'
import { Exercise } from '@/types/domain/exercise'

export default function ExerciseLibrary() {
  const { data: exercises, isLoading, error } = useExercises()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  // Extract unique categories and difficulties from exercises
  const categories = ["All", ...(exercises ? Array.from(new Set(exercises.map(ex => ex.category))) : [])]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

  const filteredExercises = exercises?.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || 
      exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1) === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  }) || []

  if (error) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading exercises</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Exercise Library</h1>
            <p className="text-muted-foreground">Pre-built exercises with filters and video previews</p>
          </div>
        </div>

        {/* Search & Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm font-medium mb-2">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search exercises..." 
                    className="pl-9" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Difficulty</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading exercises...</p>
          </div>
        )}

        {/* Exercise Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="overflow-hidden hover:border-primary transition-all">
                {/* Placeholder for video */}
                <div className="w-full h-40 bg-background flex items-center justify-center text-4xl">🎥</div>

                {/* Content */}
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-bold mb-2">{exercise.name}</CardTitle>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Muscle:</strong> {exercise.muscleGroup.join(', ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Equipment:</strong> {exercise.equipment.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        exercise.difficulty === "beginner"
                          ? "default"
                          : exercise.difficulty === "intermediate"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                    </Badge>
                    <Button variant="ghost" className="text-primary hover:text-primary/80 font-semibold text-sm p-0">
                      + Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredExercises.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-2">No exercises found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}