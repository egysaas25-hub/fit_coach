// hooks/api/useTenants.ts
import { useQuery } from '@tanstack/react-query';
import { Tenant } from '@/types/models/tenant.model';
import { tenantService } from '@/lib/api/services/tenant.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useTenants = () => {
  return useQuery<Tenant[], Error>({
    queryKey: ['tenants'],
    queryFn: () => tenantService.getAll(),
  });
};