// lib/hooks/api/useCommunication.ts
import { useState, useEffect, useCallback } from 'react';
import { CommunicationService } from '@/lib/api/services/communication.service';
import { Thread, Comment, CommunicationPlatform, FlagSeverity } from '@/types/domain/communication';

const communicationService = new CommunicationService();

export function useThreads(userId?: string) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await communicationService.getThreads(userId);
      setThreads(data);
    } catch (err) {
      setError('Failed to fetch threads');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return { threads, loading, error, refetch: fetchThreads };
}

export function useThreadMessages(threadId: string) {
  const [messages, setMessages] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await communicationService.getThreadMessages(threadId);
      setMessages(data);
    } catch (err) {
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, refetch: fetchMessages };
}

export function useCreateThread() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createThread = useCallback(async (platform: CommunicationPlatform, userId: string, title: string) => {
    setLoading(true);
    try {
      const thread = await communicationService.createThread(platform, userId, title);
      return thread;
    } catch (err) {
      setError('Failed to create thread');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createThread, loading, error };
}

export function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (threadId: string, userId: string, content: string) => {
    setLoading(true);
    try {
      const message = await communicationService.sendMessage(threadId, userId, content);
      return message;
    } catch (err) {
      setError('Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendMessage, loading, error };
}

export function useFlagThread() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flagThread = useCallback(async (threadId: string, severity: FlagSeverity) => {
    setLoading(true);
    try {
      const thread = await communicationService.flagThread(threadId, severity);
      return thread;
    } catch (err) {
      setError('Failed to flag thread');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { flagThread, loading, error };
}