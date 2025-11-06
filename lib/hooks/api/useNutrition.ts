// hooks/api/useNutrition.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NutritionPlan } from '@/types/models/nutrition.model';
import { nutritionService } from '@/lib/api/services/nutrition.service';
import { CreateNutritionPlanDto } from '@/types/api/nutrition.dto';

export const useNutritionPlans = (customerId?: string) => {
  return useQuery<NutritionPlan[], Error>({
    queryKey: ['nutrition-plans', customerId],
    queryFn: () => nutritionService.getAll(customerId),
    enabled: !!customerId,
  });
};

export const useCreateNutritionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation<NutritionPlan, Error, Partial<NutritionPlan>>({
    mutationFn: nutritionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-plans'] });
    },
  });
};