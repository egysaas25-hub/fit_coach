// lib/store/dashboard.store.ts
import { create } from 'zustand';
import { DashboardStats, ActivityFeedItem, Alert, AIInsight, QuickAction } from '@/types/domain/dashboard';
import { useDashboardStats, useActivityFeed, useAlerts, useAIInsights, useQuickActions } from '@/lib/hooks/api/useDashboard';

interface DashboardState {
  stats: DashboardStats | null;
  feed: ActivityFeedItem[];
  alerts: Alert[];
  insights: AIInsight[];
  actions: QuickAction[];
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchFeed: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchInsights: () => Promise<void>;
  fetchActions: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  feed: [],
  alerts: [],
  insights: [],
  actions: [],
  loading: false,
  error: null,
  fetchStats: async () => {
    set({ loading: true });
    try {
      const { stats, error } = await useDashboardStats();
      set({ stats, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch dashboard stats', loading: false });
    }
  },
  fetchFeed: async () => {
    set({ loading: true });
    try {
      const { feed, error } = await useActivityFeed();
      set({ feed, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch activity feed', loading: false });
    }
  },
  fetchAlerts: async () => {
    set({ loading: true });
    try {
      const { alerts, error } = await useAlerts();
      set({ alerts, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch alerts', loading: false });
    }
  },
  fetchInsights: async () => {
    set({ loading: true });
    try {
      const { insights, error } = await useAIInsights();
      set({ insights, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch AI insights', loading: false });
    }
  },
  fetchActions: async () => {
    set({ loading: true });
    try {
      const { actions, error } = await useQuickActions();
      set({ actions, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch quick actions', loading: false });
    }
  },
}));