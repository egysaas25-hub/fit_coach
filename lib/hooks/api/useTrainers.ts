// hooks/api/useTrainers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trainer } from '@/types/models/trainer.model';
import { trainerService } from '@/lib/api/services/trainer.service';
import { CreateTrainerDto } from '@/types/api/trainer.dto';

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