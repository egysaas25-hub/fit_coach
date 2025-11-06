// lib/store/progress.store.ts
import { create } from 'zustand';
import { ProgressEntry } from '@/types/models/progress.model';
import { progressService } from '@/lib/api/services/progress.service';

interface ProgressState {
  progressEntries: ProgressEntry[];
  fetchProgress: (customerId?: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set) => ({
  progressEntries: [],
  fetchProgress: async (customerId?: string) => {
    const entries = await progressService.getAll(customerId);
    set({ progressEntries: entries });
  },
}));