import { NotificationResponseDto, CreateNotificationDto } from '@/types/api/notification.dto';
import { Notification, NotificationType } from '@/types/models/notification.model';

export const notificationMapper = {
  toModel: (dto: NotificationResponseDto): Notification => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    recipientId: dto.recipient_id,
    recipientType: dto.recipient_type as 'team_member' | 'customer',
    type: dto.type as NotificationType,
    content: dto.content,
    isRead: dto.is_read,
    createdAt: new Date(dto.created_at),
  }),
  toCreateDto: (model: Partial<Notification>): CreateNotificationDto => ({
    tenant_id: model.tenantId!,
    recipient_id: model.recipientId!,
    recipient_type: model.recipientType!,
    type: model.type!,
    content: model.content!,
  }),
};