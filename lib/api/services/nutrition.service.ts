// lib/api/services/nutrition.service.ts
import { NutritionPlanResponseDto, CreateNutritionPlanDto } from '@/types/api/nutrition.dto';
import { NutritionPlan } from '@/types/models/nutrition.model';
import { nutritionMapper } from '@/lib/mappers/nutrition.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const nutritionService = {
  getAll: async (customerId?: string): Promise<NutritionPlan[]> => {
    const url = customerId ? `${endpoints.nutrition}?customer_id=${customerId}` : endpoints.nutrition;
    const { data } = await apiClient.get<NutritionPlanResponseDto[]>(url);
    return data.map(nutritionMapper.toModel);
  },
  create: async (model: Partial<NutritionPlan>): Promise<NutritionPlan> => {
    const dto = nutritionMapper.toCreateDto(model);
    const { data } = await apiClient.post<NutritionPlanResponseDto>(endpoints.nutrition, dto);
    return nutritionMapper.toModel(data);
  },
};