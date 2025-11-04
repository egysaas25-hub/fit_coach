import { useQuery } from '@tanstack/react-query';
import { Message, MessageThread } from '@/types/models/message.model';
import { messageService } from '@/lib/api/services/message.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useMessageThreads = (customerId?: string) => {
  return useQuery<MessageThread[], Error>({
    queryKey: ['messageThreads', customerId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, customerId] = queryKey;
      return messageService.getThreads(customerId as string | undefined);
    },
    enabled: !!customerId,
  });
};

export const useMessages = (threadId: number) => {
  return useQuery<Message[], Error>({
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
  };  queryKey: ['messages', threadId],
    queryFn: () => messageService.getMessages(threadId),
    enabled: !!threadId,
  });
};