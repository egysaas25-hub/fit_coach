// lib/store/ui.store.ts
import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const useUIStore = create<UIState>(set => ({
  isLoading: false,
  setLoading: isLoading => set({ isLoading }),
  toast: null,
  setToast: (message, type) => set({ toast: { message, type } }),
}));