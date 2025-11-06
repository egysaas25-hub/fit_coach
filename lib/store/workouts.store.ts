// lib/store/workouts.store.ts
import { create } from 'zustand';
import { Workout } from '@/types/models/workout.model';
import { workoutService } from '@/lib/api/services/workout.service';

interface WorkoutState {
  workouts: Workout[];
  selectedWorkout: Workout | null;
  fetchWorkouts: (customerId?: string) => Promise<void>;
  setSelectedWorkout: (workout: Workout | null) => void;
}

export const useWorkoutsStore = create<WorkoutState>((set) => ({
  workouts: [],
  selectedWorkout: null,
  fetchWorkouts: async (customerId?: string) => {
    const workouts = await workoutService.getAll(customerId);
    set({ workouts });
  },
  setSelectedWorkout: (selectedWorkout) => set({ selectedWorkout }),
}));