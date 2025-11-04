// lib/store/nutrition.store.ts
import { create } from 'zustand';
import { NutritionPlan } from '@/types/models/nutrition.model';
import { nutritionService } from '@/lib/api/services/nutrition.service';

interface NutritionState {
  nutritionPlans: NutritionPlan[];
  selectedPlan: NutritionPlan | null;
  fetchPlans: (customerId?: string) => Promise<void>;
  setSelectedPlan: (plan: NutritionPlan | null) => void;
}

export const useNutritionStore = create<NutritionState>((set) => ({
  nutritionPlans: [],
  selectedPlan: null,
  fetchPlans: async (customerId?: string) => {
    const plans = await nutritionService.getAll(customerId);
    set({ nutritionPlans: plans });
  },
  setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
}));