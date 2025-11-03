export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

export interface Message {
  id: number;
  threadId: number;
  senderId: string;
  senderType: 'team_member' | 'customer';
  content: string;
  status: MessageStatus;
  createdAt: Date;
}

export interface MessageThread {
  id: number;
  tenantId: number;
  customerId: string;
  teamMemberId: string;
  createdAt: Date;
  updatedAt: Date;
}