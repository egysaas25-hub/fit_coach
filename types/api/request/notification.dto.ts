export interface CreateNotificationDto {
  tenant_id: number;
  recipient_id: string;
  recipient_type: string;
  type: string;
  content: string;
}

export interface NotificationResponseDto {
  id: number;
  tenant_id: number;
  recipient_id: string;
  recipient_type: string;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
}