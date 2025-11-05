import { useState, useMemo } from "react"
import { workoutProgramsData, workoutTemplatesData, exerciseLibraryData } from "@/lib/workout-data"

export function useWorkout() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("programs")

  const filteredPrograms = useMemo(() => 
    workoutProgramsData.filter(program =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.goal.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  )

  const filteredTemplates = useMemo(() =>
    workoutTemplatesData.filter(template =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.type.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  )

  const filteredExercises = useMemo(() =>
    exerciseLibraryData.filter(exercise =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  )

  const stats = useMemo(() => ({
    totalPrograms: workoutProgramsData.length,
    totalClients: workoutProgramsData.reduce((sum, program) => sum + program.clients, 0),
    avgDuration: Math.round(
      workoutProgramsData.reduce((sum, program) => sum + parseInt(program.duration), 0) / workoutProgramsData.length
    ),
    totalTemplates: workoutTemplatesData.length
  }), [])

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filteredPrograms,
    filteredTemplates,
    filteredExercises,
    stats,
    allPrograms: workoutProgramsData,
    allTemplates: workoutTemplatesData,
    allExercises: exerciseLibraryData
  }
}
