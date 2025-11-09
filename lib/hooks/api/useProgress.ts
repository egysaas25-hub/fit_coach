// lib/hooks/api/useProgress.ts
import { useQuery } from '@tanstack/react-query';
import { progressService } from '@/lib/api/services/progress.service';

/**
 * Hooks for client progress and activities
 * Rule 1: Component calls hook
 * Rule 2: Hook calls service
 */

/**
 * Get client progress data
 */
export const useClientProgress = (clientId: string) => {
  return useQuery({
    queryKey: ['client', clientId, 'progress'],
    queryFn: () => progressService.getClientProgress(clientId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!clientId,
  });
};

/**
 * Get client activities feed
 */
export const useClientActivities = (
  clientId: string,
  params?: { limit?: number; from?: string }
) => {
  return useQuery({
    queryKey: ['client', clientId, 'activities', params],
    queryFn: () => progressService.getClientActivities(clientId, params),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!clientId,
  });
};
