// hooks/api/useProgress.ts
import { useQuery } from '@tanstack/react-query';
import { ProgressChart, ProgressEntry } from '@/types/models/progress.model';
import { progressService } from '@/lib/api/services/progress.service';

export const useProgressEntries = (customerId?: string) => {
  return useQuery<ProgressEntry[], Error>({
    queryKey: ['progress-entries', customerId],
    queryFn: () => progressService.getEntries(customerId),
    enabled: !!customerId,
  });
};

export const useProgressChart = (customerId: string, category: string) => {
  return useQuery<ProgressChart, Error>({
    queryKey: ['progress-chart', customerId, category],
    queryFn: () => progressService.getChartData(customerId, category),
    enabled: !!customerId && !!category,
  });
};