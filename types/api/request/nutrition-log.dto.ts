export interface CreateNutritionLogDto {
  tenant_id: number;
  customer_id: string;
  nutrition_plan_id: number;
  status: string;
  notes?: string | null;
  logged_at: string;
}

export interface UpdateNutritionLogDto {
  status?: string;
  notes?: string | null;
  logged_at?: string;
}

export interface NutritionLogResponseDto {
  id: number;
  tenant_id: number;
  customer_id: string;
  nutrition_plan_id: number;
  status: string;
  notes: string | null;
  logged_at: string;
  created_at: string;
}