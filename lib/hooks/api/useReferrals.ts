// hooks/api/useReferrals.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Referral } from '@/types/models/referral.model';
import { referralService } from '@/lib/api/services/referral.service';
import { CreateReferralDto } from '@/types/api/referral.dto';

export const useReferrals = (customerId?: string) => {
  return useQuery<Referral[], Error>({
    queryKey: ['referrals', customerId],
    queryFn: () => referralService.getAll(customerId),
    enabled: !!customerId,
  });
};

export const useCreateReferral = () => {
  const queryClient = useQueryClient();
  return useMutation<Referral, Error, Partial<Referral>>({
    mutationFn: referralService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
    },
  });
};