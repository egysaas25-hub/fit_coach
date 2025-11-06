import { NutritionLogResponseDto, CreateNutritionLogDto } from '@/types/api/nutrition-log.dto';
import { NutritionLog, NutritionLogStatus } from '@/types/models/nutrition-log.model';

export const nutritionLogMapper = {
  toModel: (dto: NutritionLogResponseDto): NutritionLog => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    customerId: dto.customer_id,
    nutritionPlanId: dto.nutrition_plan_id,
    status: dto.status as NutritionLogStatus,
    notes: dto.notes,
    loggedAt: new Date(dto.logged_at),
    createdAt: new Date(dto.created_at),
  }),
  toCreateDto: (model: Partial<NutritionLog>): CreateNutritionLogDto => ({
    tenant_id: model.tenantId!,
    customer_id: model.customerId!,
    nutrition_plan_id: model.nutritionPlanId!,
    status: model.status!,
    notes: model.notes,
    logged_at: model.loggedAt!.toISOString(),
  }),
};