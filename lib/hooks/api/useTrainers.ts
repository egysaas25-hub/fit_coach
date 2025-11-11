// hooks/api/useTrainers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trainer } from '@/types/domain/trainer.model';
import { trainerService } from '@/lib/api/services/trainer.service';

export const useTrainers = () => {
  return useQuery<Trainer[], Error>({
    queryKey: ['trainers'],
    queryFn: trainerService.getAll,
  });
};

export const useTrainer = (id: string) => {
  return useQuery<Trainer, Error>({
    queryKey: ['trainer', id],
    queryFn: () => trainerService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTrainer = () => {
  const queryClient = useQueryClient();
  return useMutation<Trainer, Error, Partial<Trainer>>({
    mutationFn: trainerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
    },
  });
};

export const useUpdateTrainer = () => {
  const queryClient = useQueryClient();
  return useMutation<Trainer, Error, { id: string; data: Partial<Trainer> }>({
    mutationFn: ({ id, data }) => trainerService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      queryClient.invalidateQueries({ queryKey: ['trainer', variables.id] });
    },
  });
};

export const useDeleteTrainer = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => trainerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
    },
  });
};