// types/domain/communication.ts
export interface Thread {
  id: string;
  platform: CommunicationPlatform;
  userId: string;
  title: string;
  lastMessageAt: string; // ISO date string
  status: ThreadStatus;
  priority: MessagePriority;
  flaggedSeverity?: FlagSeverity;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  threadId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export enum CommunicationPlatform {
  WhatsApp = 'WhatsApp',
  Messenger = 'Messenger',
  Telegram = 'Telegram',
  Instagram = 'Instagram',
  Signal = 'Signal',
}

export enum ThreadStatus {
  Open = 'Open',
  Closed = 'Closed',
  Archived = 'Archived',
}

export enum MessagePriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum FlagSeverity {
  Minor = 'Minor',
  Moderate = 'Moderate',
  Critical = 'Critical',
}

export interface CommunicationState {
  threads: Thread[];
  messages: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
  fetchThreads: (userId?: string) => Promise<void>;
  fetchMessages: (threadId: string) => Promise<void>;
}