// hooks/api/useNutrition.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NutritionPlan } from '@/types/domain/nutrition.model';
import { NutritionService } from '@/lib/api/services/nutrition.service';

const nutritionService = new NutritionService();

export const useNutritionPlans = (customerId?: string) => {
  return useQuery<NutritionPlan[], Error>({
    queryKey: ['nutrition-plans', customerId],
    queryFn: () => nutritionService.getAll(customerId),
    enabled: !!customerId,
  });
};

export const useNutritionPlan = (id: string) => {
  return useQuery<NutritionPlan, Error>({
    queryKey: ['nutrition-plan', id],
    queryFn: () => nutritionService.getById(id),
    enabled: !!id,
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

export const useUpdateNutritionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation<NutritionPlan, Error, { id: string; data: Partial<NutritionPlan> }>({
    mutationFn: ({ id, data }) => nutritionService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-plans'] });
      queryClient.invalidateQueries({ queryKey: ['nutrition-plan', variables.id] });
    },
  });
};

export const useDeleteNutritionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: nutritionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-plans'] });
    },
  });
};