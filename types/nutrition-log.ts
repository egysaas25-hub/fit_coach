// src/types/nutrition-log.ts
export type NutritionLogStatus = 'adhered' | 'partial' | 'skipped'; // From nutrition_log_status enum

export interface NutritionLog {
  id: number;
  tenant_id: number;
  customer_id: string;
  nutrition_plan_id: number;
  status: NutritionLogStatus;
  notes: string | null;
  logged_at: string;
  created_at: string;
}

export interface CreateNutritionLogDto {
  tenant_id: number;
  customer_id: string;
  nutrition_plan_id: number;
  status: NutritionLogStatus;
  notes?: string | null;
  logged_at: string;
}

export interface UpdateNutritionLogDto {
  status?: NutritionLogStatus;
  notes?: string | null;
  logged_at?: string;
}