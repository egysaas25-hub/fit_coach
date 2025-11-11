// lib/api/services/notification.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';
import { NotificationItem, NotificationsResponse } from '@/types/lib/api/services/notification.types';

export const notificationService = {
  async getNotifications(params?: { unreadOnly?: boolean; limit?: number }): Promise<NotificationsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.unreadOnly !== undefined) queryParams.append('unreadOnly', String(params.unreadOnly));
    if (params?.limit) queryParams.append('limit', String(params.limit));

    const url = `${endpoints.notification}?${queryParams.toString()}`;
    const response = await apiClient.get<ApiResponse<NotificationsResponse>>(url);
    return response.data.data;
  },

  async markRead(id: string): Promise<NotificationItem> {
    const url = endpoints.notificationRead(id);
    const response = await apiClient.patch<ApiResponse<NotificationItem>>(url);
    return response.data.data;
  },
};
