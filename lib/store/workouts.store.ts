// lib/store/workouts.store.ts
import { create } from 'zustand';
import { Workout, WorkoutState } from '@/types/domain/workout.model';
import { workoutService } from '@/lib/api/services/workout.service';

export const useWorkoutsStore = create<WorkoutState>(set => ({
  workouts: [],
  selectedWorkout: null,
  loading: false,
  error: null,
  fetchWorkouts: async (customerId?: string) => {
    set({ loading: true });
    try {
      const workouts = await workoutService.getAll(customerId);
      set({ workouts, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch workouts',
        loading: false,
      });
    }
  },
  setSelectedWorkout: selectedWorkout => set({ selectedWorkout }),
}));
