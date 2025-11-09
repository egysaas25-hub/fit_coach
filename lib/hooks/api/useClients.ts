// hooks/api/useClients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Client } from '@/types/domain/client.model';
import { clientService } from '@/lib/api/services/client.service';

/**
 * Hook for clients list
 * Rule 1: Component calls hook
 * Rule 2: Hook calls service
 */
export const useClients = () => {
  return useQuery<Client[], Error>({
    queryKey: ['clients'],
    queryFn: () => clientService.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useClient = (id: string) => {
  return useQuery<Client, Error>({
    queryKey: ['client', id],
    queryFn: () => clientService.getById(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation<Client, Error, Partial<Client>>({
    mutationFn: (data) => clientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation<Client, Error, { id: string; model: Partial<Client> }>({
    mutationFn: ({ id, model }) => clientService.update(id, model),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
    },
  });
};