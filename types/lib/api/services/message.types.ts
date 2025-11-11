export interface MessageThread {
  id: string;
  clientId: string;
  trainerId: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
  messageCount?: number;
}

export interface MessageItem {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface ThreadsResponse {
  data: MessageThread[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}