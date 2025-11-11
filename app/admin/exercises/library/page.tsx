"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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

        {/* Exercise Grid */}
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
                    <strong>Muscle:</strong> {exercise.muscle}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Equipment:</strong> {exercise.equipment}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      exercise.difficulty === "Beginner"
                        ? "default"
                        : exercise.difficulty === "Intermediate"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {exercise.difficulty}
                  </Badge>
                  <Button variant="ghost" className="text-primary hover:text-primary/80 font-semibold text-sm p-0">
                    + Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExercises.length === 0 && (
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