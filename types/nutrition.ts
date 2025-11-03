// src/types/nutrition.ts
export interface NutritionPlanMacros {
  id: number;
  carbs_grams: number;
  protein_grams: number;
  fat_grams: number;
  calories_kcal: number;
}

export interface NutritionPlan {
  id: number;
  tenant_id: number;
  customer_id: string;
  version: number;
  is_active: boolean;
  notes: string | null;
  created_by: number;
  created_at: string;
  macros: NutritionPlanMacros[];
}

export interface CreateNutritionPlanDto {
  tenant_id: number;
  customer_id: string;
  version: number;
  is_active: boolean;
  notes?: string | null;
  created_by: number;
  macros: {
    carbs_grams: number;
    protein_grams: number;
    fat_grams: number;
    calories_kcal: number;
  }[];
}

export interface UpdateNutritionPlanDto {
  version?: number;
  is_active?: boolean;
  notes?: string | null;
  macros?: {
    carbs_grams: number;
    protein_grams: number;
    fat_grams: number;
    calories_kcal: number;
  }[];
}