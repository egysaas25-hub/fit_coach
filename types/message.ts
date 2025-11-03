// src/types/message.ts
export type MessageStatus = 'sent' | 'delivered' | 'read'; // From message_status enum

export interface MessageThread {
  id: number;
  tenant_id: number;
  customer_id: string;
  team_member_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  thread_id: number;
  sender_id: string;
  sender_type: 'team_member' | 'customer';
  content: string;
  status: MessageStatus;
  created_at: string;
}

export interface CreateMessageDto {
  thread_id: number;
  sender_id: string;
  sender_type: 'team_member' | 'customer';
  content: string;
}