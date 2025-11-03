export interface ExerciseDto {
  id: number;
  tenant_id: number;
  name: { en: string };
  created_at: string;
}

export interface TrainingPlanExerciseDto {
  id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  order_index: number;
  exercise: ExerciseDto;
}

export interface CreateWorkoutDto {
  tenant_id: number;
  customer_id: string;
  version: number;
  is_active: boolean;
  split?: string | null;
  notes?: string | null;
  created_by: number;
  training_plan_exercises: {
    exercise_id: number;
    sets: number;
    reps: number;
    order_index: number;
  }[];
}

export interface UpdateWorkoutDto {
  version?: number;
  is_active?: boolean;
  split?: string | null;
  notes?: string | null;
  training_plan_exercises?: {
    exercise_id: number;
    sets: number;
    reps: number;
    order_index: number;
  }[];
}

export interface WorkoutResponseDto {
  id: number;
  tenant_id: number;
  customer_id: string;
  version: number;
  is_active: boolean;
  split: string | null;
  notes: string | null;
  created_by: number;
  created_at: string;
  training_plan_exercises: TrainingPlanExerciseDto[];
}