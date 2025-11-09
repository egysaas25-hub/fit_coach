// lib/hooks/api/useDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/lib/api/services/dashboard.service';
import { DashboardStats, ActivityFeedItem, Alert, AIInsight, QuickAction } from '@/types/domain/dashboard';

const dashboardService = new DashboardService();

/**
 * Hook for dashboard stats
 * Rule 1: Component calls hook
 * Rule 2: Hook calls service
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for activity feed
 */
export function useActivityFeed() {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => dashboardService.getActivityFeed(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook for alerts
 */
export function useAlerts() {
  return useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: () => dashboardService.getAlerts(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook for AI insights
 */
export function useAIInsights() {
  return useQuery({
    queryKey: ['dashboard', 'insights'],
    queryFn: () => dashboardService.getAIInsights(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for quick actions
 */
export function useQuickActions() {
  return useQuery({
    queryKey: ['dashboard', 'actions'],
    queryFn: () => dashboardService.getQuickActions(),
    staleTime: 10 * 60 * 1000, // 10 minutes (rarely changes)
  });
}