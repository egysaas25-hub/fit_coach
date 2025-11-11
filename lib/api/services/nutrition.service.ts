// lib/api/services/nutrition.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';
import { NutritionPlan } from '@/types/domain/nutrition.model';

export class NutritionService {
  /**
   * Get all nutrition plans
   */
  async getAll(customerId?: string): Promise<NutritionPlan[]> {
    try {
      const url = customerId 
        ? `${endpoints.nutrition}?customerId=${customerId}`
        : endpoints.nutrition;
        
      const response = await apiClient.get<ApiResponse<NutritionPlan[]>>(url);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching nutrition plans:', error);
      throw new Error('Failed to fetch nutrition plans');
    }
  }

  /**
   * Get nutrition plan by ID
   */
  async getById(id: string): Promise<NutritionPlan> {
    try {
      const response = await apiClient.get<ApiResponse<NutritionPlan>>(
        `${endpoints.nutrition}/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching nutrition plan:', error);
      throw new Error('Failed to fetch nutrition plan');
    }
  }

  /**
   * Create new nutrition plan
   */
  async create(plan: Partial<NutritionPlan>): Promise<NutritionPlan> {
    try {
      const response = await apiClient.post<ApiResponse<NutritionPlan>>(
        endpoints.nutrition,
        plan
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating nutrition plan:', error);
      throw new Error('Failed to create nutrition plan');
    }
  }

  /**
   * Update nutrition plan
   */
  async update(id: string, plan: Partial<NutritionPlan>): Promise<NutritionPlan> {
    try {
      const response = await apiClient.put<ApiResponse<NutritionPlan>>(
        `${endpoints.nutrition}/${id}`,
        plan
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating nutrition plan:', error);
      throw new Error('Failed to update nutrition plan');
    }
  }

  /**
   * Delete nutrition plan
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`${endpoints.nutrition}/${id}`);
    } catch (error) {
      console.error('Error deleting nutrition plan:', error);
      throw new Error('Failed to delete nutrition plan');
    }
  }
}