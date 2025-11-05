import { useQuery } from '@tanstack/react-query';
import { Referral } from '@/types/models/referral.model';
import { referralService } from '@/lib/api/services/referral.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useReferrals = (tenantId?: number) => {
  return useQuery<Referral[], Error>({
    queryKey: ['referrals', tenantId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, tenantId] = queryKey;
      return referralService.getAll(tenantId as number | undefined);
    },
    enabled: !!tenantId,
  });
};