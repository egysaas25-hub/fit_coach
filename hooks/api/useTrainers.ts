import { useQuery } from '@tanstack/react-query';
import { Trainer } from '@/types/models/trainer.model';
import { trainerService } from '@/lib/api/services/trainer.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useTrainers = (tenantId?: number) => {
  return useQuery<Trainer[], Error>({
    queryKey: ['trainers', tenantId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, tenantId] = queryKey;
      return trainerService.getAll(tenantId as number | undefined);
    },
    enabled: !!tenantId,
  });
};