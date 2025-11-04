import { useQuery } from '@tanstack/react-query';
import { NutritionLog } from '@/types/models/nutrition-log.model';
import { nutritionLogService } from '@/lib/api/services/nutrition-log.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useNutritionLogs = (customerId?: string) => {
  return useQuery<NutritionLog[], Error>({
    queryKey: ['nutritionLogs', customerId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, customerId] = queryKey;
      return nutritionLogService.getAll(customerId as string | undefined);
    },
    enabled: !!customerId,
  });
};