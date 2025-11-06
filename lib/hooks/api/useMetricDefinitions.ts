// hooks/api/useMetricDefinitions.ts
import { useQuery } from '@tanstack/react-query';
import { MetricDefinition } from '@/types/models/metric-definition.model';
import { metricDefinitionService } from '@/lib/api/services/metric-definition.service';

export const useMetricDefinitions = () => {
  return useQuery<MetricDefinition[], Error>({
    queryKey: ['metric-definitions'],
    queryFn: metricDefinitionService.getAll,
  });
};