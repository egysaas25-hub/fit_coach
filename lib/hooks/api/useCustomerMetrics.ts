// hooks/api/useCustomerMetrics.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomerMetric } from '@/types/models/customer-metric.model';
import { customerMetricService } from '@/lib/api/services/customer-metric.service';
import { CreateCustomerMetricDto } from '@/types/api/customer-metric.dto';

export const useCustomerMetrics = (customerId?: string) => {
  return useQuery<CustomerMetric[], Error>({
    queryKey: ['customer-metrics', customerId],
    queryFn: () => customerMetricService.getAll(customerId),
    enabled: !!customerId,
  });
};

export const useCreateCustomerMetric = () => {
  const queryClient = useQueryClient();
  return useMutation<CustomerMetric, Error, Partial<CustomerMetric>>({
    mutationFn: customerMetricService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-metrics'] });
    },
  });
};