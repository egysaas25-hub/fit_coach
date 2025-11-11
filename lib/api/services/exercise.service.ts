// lib/api/services/exercise.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { 
  Exercise,
  ExerciseCategory,
  ExerciseEquipment,
  ExerciseLog
} from '@/types/domain/exercise';
import { ApiResponse } from '@/types/shared/response';

/**
 * Exercise Service
 * Rule 5: Service calls apiClient
 * Rule 6: Uses endpoints
 */
export class ExerciseService {
  /**
   * Get all exercises
   */
  async getExercises(): Promise<Exercise[]> {
    // For now, we'll get exercises from workouts endpoint
    // In a real app, there would be a dedicated exercises endpoint
    const response = await apiClient.get<ApiResponse<any[]>>(
      endpoints.workout
    );
    
    // Extract exercises from workouts
    const workouts = response.data.data;
    const exercisesMap = new Map<string, Exercise>();
    
    workouts.forEach((workout: any) => {
      if (workout.exercises && Array.isArray(workout.exercises)) {
        workout.exercises.forEach((exercise: any) => {
          if (exercise.name && !exercisesMap.has(exercise.name)) {
            exercisesMap.set(exercise.name, {
              id: exercise.id || exercise.name,
              name: exercise.name,
              category: exercise.category || 'General',
              muscleGroup: exercise.muscleGroup || [],
              equipment: exercise.equipment || [],
              difficulty: exercise.difficulty || 'intermediate',
              description: exercise.description || '',
              instructions: exercise.instructions || [],
              isFavorite: exercise.isFavorite || false,
              usageCount: exercise.usageCount || 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        });
      }
    });
    
    return Array.from(exercisesMap.values());
  }

  /**
   * Get exercise by ID
   */
  async getExerciseById(id: string): Promise<Exercise> {
    // This would normally be a dedicated endpoint
    const exercises = await this.getExercises();
    const exercise = exercises.find(ex => ex.id === id);
    
    if (!exercise) {
      throw new Error(`Exercise with id ${id} not found`);
    }
    
    return exercise;
  }

  /**
   * Search exercises by name
   */
  async searchExercises(query: string): Promise<Exercise[]> {
    const exercises = await this.getExercises();
    return exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Get exercise categories
   */
  async getCategories(): Promise<ExerciseCategory[]> {
    // Mock implementation - in a real app this would come from an API
    return [
      { id: 'chest', name: 'Chest', description: 'Chest exercises', createdAt: new Date(), updatedAt: new Date() },
      { id: 'back', name: 'Back', description: 'Back exercises', createdAt: new Date(), updatedAt: new Date() },
      { id: 'legs', name: 'Legs', description: 'Leg exercises', createdAt: new Date(), updatedAt: new Date() },
      { id: 'shoulders', name: 'Shoulders', description: 'Shoulder exercises', createdAt: new Date(), updatedAt: new Date() },
      { id: 'arms', name: 'Arms', description: 'Arm exercises', createdAt: new Date(), updatedAt: new Date() },
      { id: 'core', name: 'Core', description: 'Core exercises', createdAt: new Date(), updatedAt: new Date() },
      { id: 'cardio', name: 'Cardio', description: 'Cardio exercises', createdAt: new Date(), updatedAt: new Date() },
    ];
  }

  /**
   * Get exercise equipment
   */
  async getEquipment(): Promise<ExerciseEquipment[]> {
    // Mock implementation - in a real app this would come from an API
    return [
      { id: 'bodyweight', name: 'Bodyweight', description: 'Bodyweight exercises', createdAt: new Date(), updatedAt: new Date() },
      { id: 'dumbbells', name: 'Dumbbells', description: 'Dumbbell exercises', createdAt: new Date(), updatedAt: new Date() },
      { id: 'barbell', name: 'Barbell', description: 'Barbell exercises', createdAt: new Date(), updatedAt: new Date() },
      { id: 'machine', name: 'Machine', description: 'Machine exercises', createdAt: new Date(), updatedAt: new Date() },
      { id: 'resistance-band', name: 'Resistance Band', description: 'Resistance band exercises', createdAt: new Date(), updatedAt: new Date() },
      { id: 'kettlebell', name: 'Kettlebell', description: 'Kettlebell exercises', createdAt: new Date(), updatedAt: new Date() },
    ];
  }

  /**
   * Create a new exercise
   */
  async createExercise(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise> {
    // In a real app, this would call a dedicated endpoint
    // For now, we'll simulate creating an exercise by adding it to a workout
    const newExercise: Exercise = {
      ...exercise,
      id: `exercise-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return newExercise;
  }

  /**
   * Update an existing exercise
   */
  async updateExercise(id: string, exercise: Partial<Exercise>): Promise<Exercise> {
    // In a real app, this would call a dedicated endpoint
    const existingExercise = await this.getExerciseById(id);
    const updatedExercise: Exercise = {
      ...existingExercise,
      ...exercise,
      id: existingExercise.id,
      createdAt: existingExercise.createdAt,
      updatedAt: new Date(),
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return updatedExercise;
  }

  /**
   * Delete an exercise
   */
  async deleteExercise(id: string): Promise<void> {
    // In a real app, this would call a dedicated endpoint
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}