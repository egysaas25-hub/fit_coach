export interface MealPlan {
  id: number
  name: string
  calories: number
  clients: number
  type: string
  protein: number
  carbs: number
  fats: number
  description: string
}

export interface NutritionTemplate {
  id: number
  type: string
  description: string
  lastUpdated: string
  status: string
  macros: string
}
export interface NutritionState {
  nutritionPlans: NutritionPlan[];
  selectedPlan: NutritionPlan | null;
  fetchPlans: (customerId?: string) => Promise<void>;
  setSelectedPlan: (plan: NutritionPlan | null) => void;
}
