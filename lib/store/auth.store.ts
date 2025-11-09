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
  tenantId: string | null;
  setToken: (token: string | null) => void;
  setTenantId: (tenantId: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStoreState>()(persist(
  (set) => ({
    token: null,
    tenantId: null,
    
    setToken: (token) => set({ token }),
    setTenantId: (tenantId) => set({ tenantId }),
    
    clearAuth: () => set({ token: null, tenantId: null }),
  }),
  {
    name: 'auth-storage',
  }
));