import { useQuery } from '@tanstack/react-query';
import { NutritionPlan } from '@/types/models/nutrition.model';
import { nutritionService } from '@/lib/api/services/nutrition.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useNutritionPlans = (customerId?: string) => {
  return useQuery<NutritionPlan[], Error>({
    queryKey: ['nutritionPlans', customerId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, customerId] = queryKey;
      return nutritionService.getAll(customerId as string | undefined);
    },
    enabled: !!customerId,
  });
};
