export interface CreateWorkoutLogDto {
  tenant_id: number;
  customer_id: string;
  training_plan_id: number;
  status: string;
  notes?: string | null;
  logged_at: string;
}

export interface UpdateWorkoutLogDto {
  status?: string;
  notes?: string | null;
  logged_at?: string;
}

export interface WorkoutLogResponseDto {
  id: number;
  tenant_id: number;
  customer_id: string;
  training_plan_id: number;
  status: string;
  notes: string | null;
  logged_at: string;
  created_at: string;
}