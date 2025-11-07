// lib/store/support.store.ts
import { create } from 'zustand';
import { Ticket } from '@/types/domain/support';
import { useTickets, useTicketStats } from '@/lib/hooks/api/useSupport';

interface SupportState {
  tickets: Ticket[];
  stats: { open: number; inProgress: number; resolved: number; avgResponseTime: string } | null;
  loading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

export const useSupportStore = create<SupportState>((set) => ({
  tickets: [],
  stats: null,
  loading: false,
  error: null,
  fetchTickets: async () => {
    set({ loading: true });
    try {
      const { tickets, error } = await useTickets();
      set({ tickets, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch tickets', loading: false });
    }
  },
  fetchStats: async () => {
    set({ loading: true });
    try {
      const { stats, error } = await useTicketStats();
      set({ stats, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch ticket stats', loading: false });
    }
  },
}));