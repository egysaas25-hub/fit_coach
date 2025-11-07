import { create } from 'zustand';
import { AuthService } from '@/lib/api/services/auth.service'; // Fixed import
import { User, AuthState } from '@/types/domain/user.model';

const authService = new AuthService();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (email: string, password: string, type: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.login(email, password, type);
      set({ user, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to log in',
        isLoading: false,
      });
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      set({ user: null, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to log out',
        isLoading: false,
      });
    }
  },
  fetchCurrentUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        isLoading: false,
      });
    }
  },
}));