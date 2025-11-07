// lib/store/user.store.ts
import {create, UserState } from 'zustand';
import {User, UserState } from '@/types/models/user.model';


export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set({ user }),
}));