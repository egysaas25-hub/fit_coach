// lib/hooks/api/useWorkouts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Workout } from '@/types/domain/workout.model';

interface WorkoutDto {
  id?: string;
  name: string;
  description: string;
  duration: number;
  level: string;
}

export class WorkoutService {
  async getWorkouts(): Promise<Workout[]> {
    const response = await fetch('/api/workouts', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch workouts');
    return response.json();
  }

  async createWorkout(data: WorkoutDto): Promise<Workout> {
    const response = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create workout');
    return response.json();
  }
}

export const useWorkouts = () => {
  const queryClient = useQueryClient();
  return useQuery<Workout[], Error>({
    queryKey: ['workouts'],
    queryFn: () => new WorkoutService().getWorkouts(),
  });
};

export const useCreateWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation<Workout, Error, WorkoutDto>({
    mutationFn: (data) => new WorkoutService().createWorkout(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workouts'] }),
  });
};