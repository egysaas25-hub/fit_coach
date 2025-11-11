// types/domain/support.ts
export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  userId: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: 'billing' | 'technical' | 'feature' | 'account' | 'other';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  content: string;
  isInternalNote: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportPriority {
  id: string;
  name: string;
  level: number;
  responseTimeHours: number;
  createdAt: Date;
  updatedAt: Date;
}