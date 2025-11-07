// lib/store/progress.store.ts
import { create } from 'zustand';
import {
  Program,
  ProgramWeek,
  ProgramExercise,
  ProgramState,
} from '@/types/domain/program';
import {
  usePrograms,
  useProgramWeeks,
  useProgramExercises,
} from '@/lib/hooks/api/useProgram';

export const useProgramStore = create<ProgramState>(set => ({
  programs: [],
  weeks: {},
  exercises: {},
  loading: false,
  error: null,
  fetchPrograms: async () => {
    set({ loading: true });
    try {
      const { programs, error } = await usePrograms();
      set({ programs, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch programs', loading: false });
    }
  },
  fetchWeeks: async (programId: string) => {
    set({ loading: true });
    try {
      const { weeks, error } = await useProgramWeeks(programId);
      set(state => ({
        weeks: { ...state.weeks, [programId]: weeks },
        error,
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to fetch program weeks', loading: false });
    }
  },
  fetchExercises: async (programId: string, weekId: string) => {
    set({ loading: true });
    try {
      const { exercises, error } = await useProgramExercises(programId, weekId);
      set(state => ({
        exercises: { ...state.exercises, [weekId]: exercises },
        error,
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to fetch program exercises', loading: false });
    }
  },
}));
