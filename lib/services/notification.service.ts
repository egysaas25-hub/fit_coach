// lib/api/services/notification.service.ts
import { NotificationResponseDto, CreateNotificationDto } from '@/types/api/notification.dto';
import { Notification } from '@/types/models/notification.model';
import { notificationMapper } from '@/lib/mappers/notification.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const notificationService = {
  getAll: async (recipientId?: string): Promise<Notification[]> => {
    const url = recipientId ? `${endpoints.notification}?recipient_id=${recipientId}` : endpoints.notification;
    const { data } = await apiClient.get<NotificationResponseDto[]>(url);
    return data.map(notificationMapper.toModel);
  },
  create: async (model: Partial<Notification>): Promise<Notification> => {
    const dto = notificationMapper.toCreateDto(model);
    const { data } = await apiClient.post<NotificationResponseDto>(endpoints.notification, dto);
    return notificationMapper.toModel(data);
  },
  markAsRead: async (id: number): Promise<void> => {
    await apiClient.patch(`${endpoints.notification}/${id}/read`);
  },
};