// src/types/workout-log.ts
export type WorkoutLogStatus = 'completed' | 'partial' | 'skipped'; // From workout_log_status enum

export interface WorkoutLog {
  id: number;
  tenant_id: number;
  customer_id: string;
  training_plan_id: number;
  status: WorkoutLogStatus;
  notes: string | null;
  logged_at: string;
  created_at: string;
}

export interface CreateWorkoutLogDto {
  tenant_id: number;
  customer_id: string;
  training_plan_id: number;
  status: WorkoutLogStatus;
  notes?: string | null;
  logged_at: string;
}

export interface UpdateWorkoutLogDto {
  status?: WorkoutLogStatus;
  notes?: string | null;
  logged_at?: string;
}