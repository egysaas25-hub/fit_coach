"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"
import { useWorkout } from "@/hooks/api/use-workouts"
import { WorkoutStats } from "@/components/features/workout/workout-stats"
import { WorkoutProgramsTable } from "@/components/features/workout/workout-programs-table"
import { WorkoutTemplatesGrid } from "@/components/features/workout/workout-templates-grid"
import { ExerciseLibraryTable } from "@/components/features/workout/exercise-library"
import { WorkoutOverviewGrid } from "@/components/features/workout/workout-overview-grid"


export default function WorkoutPage() {
  const router = useRouter()
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filteredPrograms,
    filteredTemplates,
    filteredExercises,
    stats,
    allPrograms
  } = useWorkout()

  const handleCreateProgram = () => {
    router.push("/workouts/builder")
  }

  const handleEditProgram = (programId: number) => {
    toast.info(`Editing program ${programId}`)
    router.push(`/workouts/edit/${programId}`)
  }

  const handleDuplicateProgram = (programName: string) => {
    toast.success(`Duplicated ${programName}`)
  }

  const handleDeleteProgram = (programName: string) => {
    toast.error(`Deleted ${programName}`)
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Workout Management</h1>
            <p className="text-muted-foreground mt-2">Create and manage workout programs, templates, and exercises</p>
          </div>
          <Button onClick={handleCreateProgram}>
            <Plus className="h-4 w-4 mr-2" />
            Create Program
          </Button>
        </div>

        {/* Stats */}
        <WorkoutStats {...stats} />

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search programs, templates, and exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="space-y-4">
              <TabsList>
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="programs">
                <WorkoutProgramsTable
                  programs={filteredPrograms}
                  onEdit={handleEditProgram}
                  onDuplicate={handleDuplicateProgram}
                  onDelete={handleDeleteProgram}
                />
              </TabsContent>

              <TabsContent value="templates">
                <WorkoutTemplatesGrid templates={filteredTemplates} />
              </TabsContent>

              <TabsContent value="exercises">
                <ExerciseLibraryTable exercises={filteredExercises} />
              </TabsContent>

              <TabsContent value="overview">
                <WorkoutOverviewGrid programs={allPrograms} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}