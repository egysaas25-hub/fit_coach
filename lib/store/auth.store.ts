import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth Store - UI State Only
 * Rule 7: Stores handle only UI state and global app state
 * This store manages:
 * - Authentication token (for API client)
 * - Loading states for UI feedback
 * - No server fetching (that's done by hooks)
 */
interface AuthStoreState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStoreState>()(persist(
  (set) => ({
    token: null,
    
    setToken: (token) => set({ token }),
    
    clearAuth: () => set({ token: null }),
  }),
  {
    name: 'auth-storage',
  }
));