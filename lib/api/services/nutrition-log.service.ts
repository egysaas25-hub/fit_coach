// lib/api/services/nutrition-log.service.ts
import { NutritionLogResponseDto, CreateNutritionLogDto } from '@/types/api/nutrition-log.dto';
import { NutritionLog } from '@/types/models/nutrition-log.model';
import { nutritionLogMapper } from '@/lib/mappers/nutrition-log.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const nutritionLogService = {
  getAll: async (customerId?: string): Promise<NutritionLog[]> => {
    const url = customerId ? `${endpoints.nutritionLog}?customer_id=${customerId}` : endpoints.nutritionLog;
    const { data } = await apiClient.get<NutritionLogResponseDto[]>(url);
    return data.map(nutritionLogMapper.toModel);
  },
  create: async (model: Partial<NutritionLog>): Promise<NutritionLog> => {
    const dto = nutritionLogMapper.toCreateDto(model);
    const { data } = await apiClient.post<NutritionLogResponseDto>(endpoints.nutritionLog, dto);
    return nutritionLogMapper.toModel(data);
  },
};