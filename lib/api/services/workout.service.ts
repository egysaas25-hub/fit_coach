// lib/api/services/workout.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';

/**
 * Workout Service
 * Rule 5: Service calls apiClient
 * Rule 6: Uses endpoints
 * TODO: Define proper Workout/Program types in types/domain/
 */
export class WorkoutService {
  /**
   * Get all workouts
   */
  async getWorkouts(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(endpoints.workout);
    return response.data.data;
  }

  /**
   * Get all exercises
   */
  async getExercises(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `${endpoints.workout}/exercises`
    );
    return response.data.data;
  }

  /**
   * Create new workout
   */
  async createWorkout(workout: any): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(
      endpoints.workout,
      workout
    );
    return response.data.data;
  }
}