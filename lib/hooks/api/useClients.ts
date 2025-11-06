// hooks/api/useClients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Client } from '@/types/models/client.model';
import { clientService } from '@/lib/api/services/client.service';
import { CreateClientDto } from '@/types/api/client.dto';

export const useClients = () => {
  return useQuery<Client[], Error>({
    queryKey: ['clients'],
    queryFn: clientService.getAll,
  });
};

export const useClient = (id: string) => {
  return useQuery<Client, Error>({
    queryKey: ['client', id],
    queryFn: () => clientService.getById(id),
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation<Client, Error, Partial<Client>>({
    mutationFn: clientService.create,
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