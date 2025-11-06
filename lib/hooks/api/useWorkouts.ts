// hooks/api/useWorkouts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Workout } from '@/types/models/workout.model';
import { workoutService } from '@/lib/api/services/workout.service';
import { CreateWorkoutDto } from '@/types/api/workout.dto';

export const useWorkouts = (customerId?: string) => {
  return useQuery<Workout[], Error>({
    queryKey: ['workouts', customerId],
    queryFn: () => workoutService.getAll(customerId),
    enabled: !!customerId,
  });
};

export const useCreateWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation<Workout, Error, Partial<Workout>>({
    mutationFn: workoutService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
};