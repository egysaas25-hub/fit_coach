export interface CreateMessageDto {
  thread_id: number;
  sender_id: string;
  sender_type: string;
  content: string;
}

export interface MessageResponseDto {
  id: number;
  thread_id: number;
  sender_id: string;
  sender_type: string;
  content: string;
  status: string;
  created_at: string;
}

export interface MessageThreadResponseDto {
  id: number;
  tenant_id: number;
  customer_id: string;
  team_member_id: string;
  created_at: string;
  updated_at: string;
}