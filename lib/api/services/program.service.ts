// lib/api/services/program.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';
import { Workout } from '@/types/domain/workout.model';

export class ProgramService {
  async getPrograms(): Promise<Workout[]> {
    try {
      const response = await apiClient.get<ApiResponse<Workout[]>>(endpoints.workout);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw new Error('Failed to fetch programs');
    }
  }

  async createProgram(program: Partial<Workout>): Promise<Workout> {
    try {
      const response = await apiClient.post<ApiResponse<Workout>>(
        endpoints.workout,
        program
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating program:', error);
      throw new Error('Failed to create program');
    }
  }

  async updateProgram(programId: string, updates: Partial<Workout>): Promise<Workout> {
    try {
      const response = await apiClient.patch<ApiResponse<Workout>>(
        `${endpoints.workout}/${programId}`,
        updates
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating program:', error);
      throw new Error('Failed to update program');
    }
  }

  async getProgramWeeks(programId: string): Promise<any[]> {
    try {
      // This would need a proper endpoint in a real implementation
      // For now, we'll return an empty array
      return [];
    } catch (error) {
      console.error('Error fetching program weeks:', error);
      throw new Error('Failed to fetch program weeks');
    }
  }

  async getProgramExercises(programId: string, weekId: string): Promise<any[]> {
    try {
      // This would need a proper endpoint in a real implementation
      // For now, we'll return an empty array
      return [];
    } catch (error) {
      console.error('Error fetching program exercises:', error);
      throw new Error('Failed to fetch program exercises');
    }
  }
}