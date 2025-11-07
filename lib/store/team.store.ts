// lib/store/team.store.ts
import { create } from 'zustand';
import { TeamMember, Role, Permission, TeamState } from '@/types/domain/team';
import {
  useTeamMembers,
  useRoles,
  usePermissions,
} from '@/lib/hooks/api/useTeam';

export const useTeamStore = create<TeamState>(set => ({
  members: [],
  roles: [],
  permissions: [],
  loading: false,
  error: null,
  fetchMembers: async () => {
    set({ loading: true });
    try {
      const { members, error } = await useTeamMembers();
      set({ members, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch team members', loading: false });
    }
  },
  fetchRoles: async () => {
    set({ loading: true });
    try {
      const { roles, error } = await useRoles();
      set({ roles, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch roles', loading: false });
    }
  },
  fetchPermissions: async () => {
    set({ loading: true });
    try {
      const { permissions, error } = await usePermissions();
      set({ permissions, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch permissions', loading: false });
    }
  },
}));
