// hooks/api/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Notification } from '@/types/models/notification.model';
import { notificationService } from '@/lib/api/services/notification.service';
import { CreateNotificationDto } from '@/types/api/notification.dto';

export const useNotifications = (recipientId?: string) => {
  return useQuery<Notification[], Error>({
    queryKey: ['notifications', recipientId],
    queryFn: () => notificationService.getAll(recipientId),
    enabled: !!recipientId,
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation<Notification, Error, Partial<Notification>>({
    mutationFn: notificationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};