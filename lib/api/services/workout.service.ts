// lib/api/services/workout.service.ts
import { Program, ProgramExercise } from '@/types/domain/program';

export class WorkoutService {
  async getWorkouts(): Promise<Program[]> {
    try {
      const response = await fetch('/api/workouts');
      const data = await response.json();
      return data as Program[];
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw new Error('Failed to fetch workouts');
    }
  }

  async getExercises(): Promise<ProgramExercise[]> {
    try {
      const response = await fetch('/api/workouts/exercises');
      const data = await response.json();
      return data as ProgramExercise[];
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw new Error('Failed to fetch exercises');
    }
  }

  async createWorkout(workout: Partial<Program>): Promise<Program> {
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });
      const data = await response.json();
      return data as Program;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw new Error('Failed to create workout');
    }
  }
}