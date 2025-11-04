import { useQuery } from '@tanstack/react-query';
import { Client } from '@/types/models/client.model';
import { clientService } from '@/lib/api/services/client.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useClients = (tenantId?: number) => {
  return useQuery<Client[], Error>({
    queryKey: ['clients', tenantId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, tenantId] = queryKey;
      return clientService.getAll(tenantId as number | undefined);
    },
    enabled: !!tenantId,
  });
};