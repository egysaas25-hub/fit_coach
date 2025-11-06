// hooks/api/useCheckIns.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckIn } from '@/types/models/check-in.model';
import { checkInService } from '@/lib/api/services/check-in.service';
import { CreateCheckInDto } from '@/types/api/check-in.dto';

export const useCheckIns = () => {
  return useQuery<CheckIn[], Error>({
    queryKey: ['check-ins'],
    queryFn: checkInService.getAll,
  });
};

export const useCreateCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation<CheckIn, Error, Partial<CheckIn>>({
    mutationFn: checkInService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['check-ins'] });
    },
  });
};