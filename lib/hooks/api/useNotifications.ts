// lib/hooks/api/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, NotificationsResponse } from '../../api/services/notification.service';

export const useNotifications = (params?: { unreadOnly?: boolean; limit?: number }) => {
  return useQuery<NotificationsResponse>({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getNotifications(params),
    staleTime: 60_000, // 1 min
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
