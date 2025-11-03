// src/types/workout.ts
export interface Exercise {
  id: number;
  tenant_id: number;
  name: { en: string };
  created_at: string;
}

export interface TrainingPlanExercise {
  id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  order_index: number;
  exercise: Exercise;
}

export interface Workout {
  id: number;
  tenant_id: number;
  customer_id: string;
  version: number;
  is_active: boolean;
  split: string | null;
  notes: string | null;
  created_by: number;
  created_at: string;
  training_plan_exercises: TrainingPlanExercise[];
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