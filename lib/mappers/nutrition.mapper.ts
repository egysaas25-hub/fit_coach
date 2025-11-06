import { NutritionPlanResponseDto, CreateNutritionPlanDto, NutritionPlanMacrosDto } from '@/types/api/nutrition.dto';
import { NutritionPlan, NutritionPlanMacros } from '@/types/models/nutrition.model';

export const nutritionMapper = {
  toModel: (dto: NutritionPlanResponseDto): NutritionPlan => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    customerId: dto.customer_id,
    version: dto.version,
    isActive: dto.is_active,
    notes: dto.notes,
    createdBy: dto.created_by,
    createdAt: new Date(dto.created_at),
    macros: dto.macros.map(m => ({
      id: m.id,
      carbsGrams: m.carbs_grams,
      proteinGrams: m.protein_grams,
      fatGrams: m.fat_grams,
      caloriesKcal: m.calories_kcal,
    })),
    totalCalories: dto.macros.reduce((sum, m) => sum + m.calories_kcal, 0),
  }),
  toCreateDto: (model: Partial<NutritionPlan>): CreateNutritionPlanDto => ({
    tenant_id: model.tenantId!,
    customer_id: model.customerId!,
    version: model.version!,
    is_active: model.isActive!,
    notes: model.notes,
    created_by: model.createdBy!,
    macros: model.macros!.map(m => ({
      carbs_grams: m.carbsGrams,
      protein_grams: m.proteinGrams,
      fat_grams: m.fatGrams,
      calories_kcal: m.caloriesKcal,
    })),
  }),
};