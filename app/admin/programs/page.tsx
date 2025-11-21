"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePrograms } from '@/lib/hooks/api/useProgram';
import { Workout } from '@/types/domain/workout.model';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface NutritionPlan {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  calories?: number;
  version: number;
  isActive: boolean;
}

export default function ProgramsListPage() {
  const { programs, loading: workoutsLoading, error: workoutsError, refetch: refetchWorkouts } = usePrograms();
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [nutritionError, setNutritionError] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const router = useRouter();

  // Fetch nutrition plans
  useEffect(() => {
    const fetchNutritionPlans = async () => {
      setNutritionLoading(true);
      try {
        const response = await fetch('/api/nutrition');
        if (!response.ok) {
          throw new Error('Failed to fetch nutrition plans');
        }
        const data = await response.json();
        setNutritionPlans(data.data || []);
      } catch (err) {
        setNutritionError('Failed to fetch nutrition plans');
      } finally {
        setNutritionLoading(false);
      }
    };

    fetchNutritionPlans();
  }, []);

  const handleDuplicateWorkout = async (workoutId: string) => {
    setDuplicating(`workout-${workoutId}`);
    try {
      const response = await fetch(`/api/workouts/${workoutId}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to duplicate workout');
      }

      const result = await response.json();
      const newWorkoutId = result.data.id;

      toast.success('Workout duplicated successfully', {
        description: 'Click to view the duplicate',
        action: {
          label: 'View',
          onClick: () => router.push(`/admin/programs/training/${newWorkoutId}/edit`),
        },
      });

      // Refresh the workouts list
      refetchWorkouts();
    } catch (err) {
      toast.error('Failed to duplicate workout');
    } finally {
      setDuplicating(null);
    }
  };

  const handleDuplicateNutrition = async (planId: string) => {
    setDuplicating(`nutrition-${planId}`);
    try {
      const response = await fetch(`/api/nutrition/${planId}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to duplicate nutrition plan');
      }

      const result = await response.json();
      const newPlanId = result.data.id;

      toast.success('Nutrition plan duplicated successfully', {
        description: 'Click to view the duplicate',
        action: {
          label: 'View',
          onClick: () => router.push(`/admin/programs/nutrition/${newPlanId}/edit`),
        },
      });

      // Refresh the nutrition plans list
      const response2 = await fetch('/api/nutrition');
      if (response2.ok) {
        const data = await response2.json();
        setNutritionPlans(data.data || []);
      }
    } catch (err) {
      toast.error('Failed to duplicate nutrition plan');
    } finally {
      setDuplicating(null);
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Programs</h1>
        <div className="flex gap-2">
          <Button asChild>
            <a href="/admin/programs/training/new">New Workout</a>
          </Button>
          <Button asChild>
            <a href="/admin/programs/nutrition/new">New Nutrition Plan</a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="workouts" className="w-full">
        <TabsList>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle>Training Programs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {workoutsLoading && <div>Loading workouts...</div>}
              {workoutsError && <div className="text-destructive">{workoutsError}</div>}
              {!workoutsLoading && programs.length === 0 && (
                <div className="text-muted-foreground text-center py-8">
                  No workouts found. Create your first workout to get started.
                </div>
              )}
              {programs.map((p: Workout) => (
                <div key={p.id} className="flex items-center justify-between border border-border rounded-md p-3">
                  <div>
                    <div className="font-medium">Workout #{p.id}</div>
                    <div className="text-xs text-muted-foreground">
                      Exercises: {p.totalExercises || 0}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <a href={`/admin/programs/training/${p.id}/edit`}>Edit</a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicateWorkout(String(p.id))}
                      disabled={duplicating === `workout-${p.id}`}
                    >
                      {duplicating === `workout-${p.id}` ? 'Duplicating...' : 'Duplicate'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Plans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {nutritionLoading && <div>Loading nutrition plans...</div>}
              {nutritionError && <div className="text-destructive">{nutritionError}</div>}
              {!nutritionLoading && nutritionPlans.length === 0 && (
                <div className="text-muted-foreground text-center py-8">
                  No nutrition plans found. Create your first nutrition plan to get started.
                </div>
              )}
              {nutritionPlans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between border border-border rounded-md p-3">
                  <div>
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {plan.calories ? `${plan.calories} calories` : 'No calorie target'} • Version {plan.version}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <a href={`/admin/programs/nutrition/${plan.id}/edit`}>Edit</a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicateNutrition(plan.id)}
                      disabled={duplicating === `nutrition-${plan.id}`}
                    >
                      {duplicating === `nutrition-${plan.id}` ? 'Duplicating...' : 'Duplicate'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}