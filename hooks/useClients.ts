// lib/hooks/api/useClients.ts
import { useQuery } from '@tanstack/react-query';
import { Client } from '@/types/models/client.model';
import { clientService } from '@/lib/api/services/client.service';

export const useClients = () => {
  return useQuery<Client[], Error>({
    queryKey: ['clients'],
    queryFn: clientService.getAll,
  });
};