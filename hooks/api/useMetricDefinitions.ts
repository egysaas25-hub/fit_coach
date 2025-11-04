import { useQuery } from '@tanstack/react-query';
import { MetricDefinition } from '@/types/models/metric-definition.model';
import { metricDefinitionService } from '@/lib/api/services/metric-definition.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useMetricDefinitions = (tenantId?: number) => {
  return useQuery<MetricDefinition[], Error>({
    queryKey: ['metricDefinitions', tenantId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, tenantId] = queryKey;
      return metricDefinitionService.getAll(tenantId as number | undefined);
    },
    enabled: !!tenantId,
  });
};