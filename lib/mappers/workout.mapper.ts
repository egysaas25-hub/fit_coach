import { WorkoutResponseDto, CreateWorkoutDto, ExerciseDto, TrainingPlanExerciseDto } from '@/types/api/workout.dto';
import { Workout, Exercise, TrainingPlanExercise } from '@/types/models/workout.model';

export const workoutMapper = {
  toExerciseModel: (dto: ExerciseDto): Exercise => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    name: dto.name.en,
    createdAt: new Date(dto.created_at),
  }),
  toTrainingPlanExerciseModel: (dto: TrainingPlanExerciseDto): TrainingPlanExercise => ({
    id: dto.id,
    exerciseId: dto.exercise_id,
    sets: dto.sets,
    reps: dto.reps,
    orderIndex: dto.order_index,
    exercise: workoutMapper.toExerciseModel(dto.exercise),
    totalReps: dto.sets * dto.reps,
  }),
  toModel: (dto: WorkoutResponseDto): Workout => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    customerId: dto.customer_id,
    version: dto.version,
    isActive: dto.is_active,
    split: dto.split,
    notes: dto.notes,
    createdBy: dto.created_by,
    createdAt: new Date(dto.created_at),
    trainingPlanExercises: dto.training_plan_exercises.map(workoutMapper.toTrainingPlanExerciseModel),
    totalSets: dto.training_plan_exercises.reduce((sum, ex) => sum + ex.sets, 0),
    totalExercises: dto.training_plan_exercises.length,
  }),
  toCreateDto: (model: Partial<Workout>): CreateWorkoutDto => ({
    tenant_id: model.tenantId!,
    customer_id: model.customerId!,
    version: model.version!,
    is_active: model.isActive!,
    split: model.split,
    notes: model.notes,
    created_by: model.createdBy!,
    training_plan_exercises: model.trainingPlanExercises!.map(ex => ({
      exercise_id: ex.exerciseId,
      sets: ex.sets,
      reps: ex.reps,
      order_index: ex.orderIndex,
    })),
  }),
};