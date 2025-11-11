// lib/api/services/nutrition.service.ts
import { Meal, Food } from '@/types/lib/api/services/nutrition.types';

export class NutritionService {
  async getMeals(): Promise<Meal[]> {
    try {
      const response = await fetch('/api/nutrition/meals');
      const data = await response.json();
      return data as Meal[];
    } catch (error) {
      console.error('Error fetching meals:', error);
      throw new Error('Failed to fetch meals');
    }
  }

  async createMeal(meal: Partial<Meal>): Promise<Meal> {
    try {
      const response = await fetch('/api/nutrition/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meal),
      });
      const data = await response.json();
      return data as Meal;
    } catch (error) {
      console.error('Error creating meal:', error);
      throw new Error('Failed to create meal');
    }
  }

  async getFoods(): Promise<Food[]> {
    try {
      const response = await fetch('/api/nutrition/foods');
      const data = await response.json();
      return data as Food[];
    } catch (error) {
      console.error('Error fetching foods:', error);
      throw new Error('Failed to fetch foods');
    }
  }
}