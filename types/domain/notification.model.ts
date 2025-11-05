export enum NotificationType {
  WORKOUT_ASSIGNED = 'workout_assigned',
  MESSAGE_RECEIVED = 'message_received',
  APPOINTMENT_SCHEDULED = 'appointment_scheduled',
}

export interface Notification {
  id: number;
  tenantId: number;
  recipientId: string;
  recipientType: 'team_member' | 'customer';
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: Date;
}