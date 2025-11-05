import { useQuery } from '@tanstack/react-query';
import { ProgressEntry } from '@/types/models/progress.model';
import { progressService } from '@/lib/api/services/progress.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useProgressEntries = (customerId?: string) => {
  return useQuery<ProgressEntry[], Error>({
    queryKey: ['progressEntries', customerId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, customerId] = queryKey;
      return progressService.getAll(customerId as string | undefined);
    },
    enabled: !!customerId,
  });
};