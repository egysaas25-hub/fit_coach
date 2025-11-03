// lib/store/auth.store.ts
import { create } from 'zustand';
import { User } from '@/types/models/user.model';
import { authService } from '@/lib/api/services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, type: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  login: async (email, password, type) => {
    const { user, token } = await authService.login({ email, password, type });
    set({ user, token });
  },
  logout: () => set({ user: null, token: null }),
}));