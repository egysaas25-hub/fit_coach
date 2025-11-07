// lib/store/ui.store.ts
import { create } from 'zustand';
import { UIState } from '@/types/domain/settings';

export const useUIStore = create<UIState>(set => ({
  isLoading: false,
  setLoading: isLoading => set({ isLoading }),
  toast: null,
  setToast: (message, type) => set({ toast: { message, type } }),
}));