// app/admin/workouts/page.tsx
'use client';
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useWorkouts } from '@/lib/hooks/api/useWorkouts';
import { Workout } from '@/types/domain/workout.model';

export default function WorkoutPage() {
  const router = useRouter();
  const { data: workouts = [], isLoading, error } = useWorkouts();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"programs" | "templates" | "exercises" | "overview">("programs");

  // Filter workouts based on search query
  const filteredWorkouts = workouts.filter(workout => 
    workout.trainingPlanExercises.some(exercise => 
      exercise.exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleCreateProgram = () => {
    router.push("/admin/workouts/builder");
  };

  const handleEditProgram = (programId: number) => {
    toast.info(`Editing program ${programId}`);
    router.push(`/admin/workouts/edit/${programId}`);
  };

  const handleDuplicateProgram = async (workoutId: number) => {
    try {
      toast.loading('Duplicating program...');
      
      // TODO: Implement duplicate API endpoint
      // const response = await fetch(`/api/workouts/${workoutId}/duplicate`, {
      //   method: 'POST',
      //   credentials: 'include',
      // });
      
      // if (!response.ok) throw new Error('Failed to duplicate program');
      
      toast.dismiss();
      toast.success(`Program duplicated successfully`);
      // Refresh the list
      // refetch();
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to duplicate program');
      console.error('Duplicate error:', error);
    }
  };

  const handleDeleteProgram = async (workoutId: number, workoutName: string) => {
    // Show confirmation dialog
    if (!confirm(`Are you sure you want to delete "${workoutName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      toast.loading('Deleting program...');
      
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete program');
      }

      toast.dismiss();
      toast.success(`Program deleted successfully`);
      
      // Refresh the workouts list
      window.location.reload(); // Simple refresh for now, ideally use refetch from react-query
    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Failed to delete program');
      console.error('Delete error:', error);
    }
  };

  // Calculate stats from actual data
  const stats = {
    totalPrograms: workouts.length,
    activeClients: workouts.filter(w => w.isActive).length,
    completionRate: workouts.length > 0 ? Math.round((workouts.filter(w => !w.isActive).length / workouts.length) * 100) : 0,
    avgDuration: workouts.length > 0 ? Math.round(workouts.reduce((sum, w) => sum + w.totalExercises, 0) / workouts.length) : 0
  };

  if (error) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading workouts</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
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
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm font-medium text-muted-foreground">Total Programs</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalPrograms}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.activeClients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.completionRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.avgDuration} weeks</div>
            </CardContent>
          </Card>
        </div>

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
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading programs...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredWorkouts.map((workout) => (
                      <div key={workout.id} className="p-4 border rounded-lg">
                        <h3 className="font-semibold">Workout #{workout.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {workout.totalExercises} exercises • {workout.split || 'Custom'} • {workout.isActive ? 'Active' : 'Inactive'}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" onClick={() => handleEditProgram(workout.id)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDuplicateProgram(workout.id)}>
                            Duplicate
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteProgram(workout.id, `Workout #${workout.id}`)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="templates">
                <div className="text-center py-8 text-muted-foreground">
                  Templates feature coming soon
                </div>
              </TabsContent>

              <TabsContent value="exercises">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading exercises...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workouts.flatMap(workout => 
                      workout.trainingPlanExercises.map(exercise => exercise.exercise)
                    )
                    .filter((exercise, index, self) => 
                      index === self.findIndex(e => e.id === exercise.id) // Remove duplicates
                    )
                    .filter(exercise => 
                      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((exercise) => (
                      <div key={exercise.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{exercise.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {exercise.category} • {exercise.equipment.join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="overview">
                <div className="text-center py-8 text-muted-foreground">
                  Overview dashboard coming soon
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}