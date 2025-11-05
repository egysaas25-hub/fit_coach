import { useQuery } from '@tanstack/react-query';
import { CheckIn } from '@/types/models/check-in.model';
import { checkInService } from '@/lib/api/services/check-in.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useCheckIns = (customerId?: string) => {
  return useQuery<CheckIn[], Error>({
    queryKey: ['checkIns', customerId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, customerId] = queryKey;
      return checkInService.getAll(customerId as string | undefined);
    },
    enabled: !!customerId,
  });
};