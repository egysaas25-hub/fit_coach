// hooks/api/useNutritionLogs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NutritionLog } from '@/types/models/nutrition-log.model';
import { nutritionLogService } from '@/lib/api/services/nutrition-log.service';
import { CreateNutritionLogDto } from '@/types/api/nutrition-log.dto';

export const useNutritionLogs = (customerId?: string) => {
  return useQuery<NutritionLog[], Error>({
    queryKey: ['nutrition-logs', customerId],
    queryFn: () => nutritionLogService.getAll(customerId),
    enabled: !!customerId,
  });
};

export const useCreateNutritionLog = () => {
  const queryClient = useQueryClient();
  return useMutation<NutritionLog, Error, Partial<NutritionLog>>({
    mutationFn: nutritionLogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-logs'] });
    },
  });
};