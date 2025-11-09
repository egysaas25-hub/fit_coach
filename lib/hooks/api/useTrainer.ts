// lib/hooks/api/useTrainer.ts
import { useQuery } from '@tanstack/react-query';
import { trainerService } from '@/lib/api/services/trainer.service';

/**
 * Hooks for trainer data
 * Rule 1: Component calls hook
 * Rule 2: Hook calls service
 */

/**
 * Get trainer dashboard data
 */
export const useTrainerDashboard = (trainerId: string) => {
  return useQuery({
    queryKey: ['trainer', trainerId, 'dashboard'],
    queryFn: () => trainerService.getDashboardData(trainerId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!trainerId,
  });
};

/**
 * Get trainer's clients
 */
export const useTrainerClients = (trainerId: string) => {
  return useQuery({
    queryKey: ['trainer', trainerId, 'clients'],
    queryFn: () => trainerService.getClients(trainerId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!trainerId,
  });
};
