// src/types/notification.ts
export type NotificationType = 'workout_assigned' | 'message_received' | 'appointment_scheduled'; // From notification_type enum

export interface Notification {
  id: number;
  tenant_id: number;
  recipient_id: string;
  recipient_type: 'team_member' | 'customer';
  type: NotificationType;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface CreateNotificationDto {
  tenant_id: number;
  recipient_id: string;
  recipient_type: 'team_member' | 'customer';
  type: NotificationType;
  content: string;
}