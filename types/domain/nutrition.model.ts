export interface NutritionPlanMacros {
  id: number;
  carbsGrams: number;
  proteinGrams: number;
  fatGrams: number;
  caloriesKcal: number;
}

export interface NutritionPlan {
  id: number;
  tenantId: number;
  customerId: string;
  version: number;
  isActive: boolean;
  notes: string | null;
  createdBy: number;
  createdAt: Date;
  macros: NutritionPlanMacros[];
  totalCalories: number; // Computed
}