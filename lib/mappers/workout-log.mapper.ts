import { WorkoutLogResponseDto, CreateWorkoutLogDto } from '@/types/api/workout-log.dto';
import { WorkoutLog, WorkoutLogStatus } from '@/types/models/workout-log.model';

export const workoutLogMapper = {
  toModel: (dto: WorkoutLogResponseDto): WorkoutLog => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    customerId: dto.customer_id,
    trainingPlanId: dto.training_plan_id,
    status: dto.status as WorkoutLogStatus,
    notes: dto.notes,
    loggedAt: new Date(dto.logged_at),
    createdAt: new Date(dto.created_at),
  }),
  toCreateDto: (model: Partial<WorkoutLog>): CreateWorkoutLogDto => ({
    tenant_id: model.tenantId!,
    customer_id: model.customerId!,
    training_plan_id: model.trainingPlanId!,
    status: model.status!,
    notes: model.notes,
    logged_at: model.loggedAt!.toISOString(),
  }),
};