import { useQuery } from '@tanstack/react-query';
import { Notification } from '@/types/models/notification.model';
import { notificationService } from '@/lib/api/services/notification.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useNotifications = (recipientId?: number) => {
  return useQuery<Notification[], Error>({
    queryKey: ['notifications', recipientId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, recipientId] = queryKey;
      return notificationService.getAll(recipientId as number | undefined);
    },
    enabled: !!recipientId,
  });
};
