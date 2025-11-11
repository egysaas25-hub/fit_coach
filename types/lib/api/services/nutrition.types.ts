/**
 * Nutrition Service Types
 */

export interface Meal {
  id: string;
  name: string;
  foods: Food[];
}

export interface Food {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}