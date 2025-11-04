import { useQuery } from '@tanstack/react-query';
import { Workout } from '@/types/models/workout.model';
import { workoutService } from '@/lib/api/services/workout.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useWorkouts = (customerId?: string) => {
  return useQuery<Workout[], Error>({
    queryKey: ['workouts', customerId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, customerId] = queryKey;
      return workoutService.getAll(customerId as string | undefined);
    },
    enabled: !!customerId,
  });
};