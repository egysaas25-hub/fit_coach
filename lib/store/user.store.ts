import { UserState } from '@/types/domain/user.model';
import {create} from 'zustand';


export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set({ user }),
}));