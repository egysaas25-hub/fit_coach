// lib/mappers/communication.mapper.ts
import { Thread, Comment, CommunicationPlatform, ThreadStatus, MessagePriority, FlagSeverity } from '@/types/domain/communication';

interface RawThread {
  thread_id: string;
  platform: string;
  user_id: string;
  title: string;
  last_message_at: string;
  status: string;
  priority: string;
  flagged_severity?: string;
  created_at: string;
  updated_at: string;
}

interface RawComment {
  comment_id: string;
  thread_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export class CommunicationMapper {
  static toDomainThread(raw: RawThread): Thread {
    return {
      id: raw.thread_id,
      platform: raw.platform as CommunicationPlatform,
      userId: raw.user_id,
      title: raw.title,
      lastMessageAt: raw.last_message_at,
      status: raw.status as ThreadStatus,
      priority: raw.priority as MessagePriority,
      flaggedSeverity: raw.flagged_severity as FlagSeverity | undefined,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }

  static toDomainThreads(rawThreads: RawThread[]): Thread[] {
    return rawThreads.map(this.toDomainThread);
  }

  static toDomainComment(raw: RawComment): Comment {
    return {
      id: raw.comment_id,
      threadId: raw.thread_id,
      userId: raw.user_id,
      content: raw.content,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }

  static toDomainComments(rawComments: RawComment[]): Comment[] {
    return rawComments.map(this.toDomainComment);
  }
}