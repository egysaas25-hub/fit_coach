// hooks/api/useWorkoutLogs.ts
import { useQuery } from '@tanstack/react-query';
import { WorkoutLog } from '@/types/models/workout-log.model';
import { workoutLogService } from '@/lib/api/services/workout-log.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useWorkoutLogs = (customerId?: string) => {
  return useQuery<WorkoutLog[], Error>({
    queryKey: ['workoutLogs', customerId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, customerId] = queryKey;
      return workoutLogService.getAll(customerId as string | undefined);
    },
    enabled: !!customerId,
  });
};