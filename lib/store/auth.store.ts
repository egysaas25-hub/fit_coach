// lib/store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/models/user.model';
import { authService } from '@/lib/api/services/auth.service';
import { LoginDto } from '@/types/api/auth.dto';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, type: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password, type) => {
        const { user, token } = await authService.login({ email, password, type });
        set({ user, token });
      },
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);