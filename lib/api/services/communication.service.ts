// lib/api/services/communication.service.ts
import { Thread, Comment, CommunicationPlatform, ThreadStatus, MessagePriority } from '@/types/domain/communication';

export class CommunicationService {
  async getThreads(userId?: string): Promise<Thread[]> {
    try {
      // Mock API call (replace with actual API endpoint)
      const response = await fetch(`/api/threads${userId ? `?userId=${userId}` : ''}`);
      const data = await response.json();
      return data as Thread[];
    } catch (error) {
      console.error('Error fetching threads:', error);
      throw new Error('Failed to fetch threads');
    }
  }

  async getThreadMessages(threadId: string): Promise<Comment[]> {
    try {
      const response = await fetch(`/api/threads/${threadId}/messages`);
      const data = await response.json();
      return data as Comment[];
    } catch (error) {
      console.error('Error fetching thread messages:', error);
      throw new Error('Failed to fetch thread messages');
    }
  }

  async createThread(platform: CommunicationPlatform, userId: string, title: string): Promise<Thread> {
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, userId, title, status: ThreadStatus.Open, priority: MessagePriority.Medium }),
      });
      const data = await response.json();
      return data as Thread;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw new Error('Failed to create thread');
    }
  }

  async sendMessage(threadId: string, userId: string, content: string): Promise<Comment> {
    try {
      const response = await fetch(`/api/threads/${threadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content }),
      });
      const data = await response.json();
      return data as Comment;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  async flagThread(threadId: string, severity: FlagSeverity): Promise<Thread> {
    try {
      const response = await fetch(`/api/threads/${threadId}/flag`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flaggedSeverity: severity }),
      });
      const data = await response.json();
      return data as Thread;
    } catch (error) {
      console.error('Error flagging thread:', error);
      throw new Error('Failed to flag thread');
    }
  }
}