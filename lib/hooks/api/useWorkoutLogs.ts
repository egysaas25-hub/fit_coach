// hooks/api/useWorkoutLogs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkoutLog } from '@/types/models/workout-log.model';
import { workoutLogService } from '@/lib/api/services/workout-log.service';
import { CreateWorkoutLogDto } from '@/types/api/workout-log.dto';

export const useWorkoutLogs = (customerId?: string) => {
  return useQuery<WorkoutLog[], Error>({
    queryKey: ['workout-logs', customerId],
    queryFn: () => workoutLogService.getAll(customerId),
    enabled: !!customerId,
  });
};

export const useCreateWorkoutLog = () => {
  const queryClient = useQueryClient();
  return useMutation<WorkoutLog, Error, Partial<WorkoutLog>>({
    mutationFn: workoutLogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-logs'] });
    },
  });
};