// lib/store/communication.store.ts
import { create } from 'zustand';
import { Thread, Comment } from '@/types/domain/communication';
import { useThreads, useThreadMessages } from '@/lib/hooks/api/useCommunication';

interface CommunicationState {
  threads: Thread[];
  messages: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
  fetchThreads: (userId?: string) => Promise<void>;
  fetchMessages: (threadId: string) => Promise<void>;
}

export const useCommunicationStore = create<CommunicationState>((set) => ({
  threads: [],
  messages: {},
  loading: false,
  error: null,
  fetchThreads: async (userId?: string) => {
    set({ loading: true });
    try {
      const { threads, error } = await useThreads(userId);
      set({ threads, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch threads', loading: false });
    }
  },
  fetchMessages: async (threadId: string) => {
    set({ loading: true });
    try {
      const { messages, error } = await useThreadMessages(threadId);
      set((state) => ({
        messages: { ...state.messages, [threadId]: messages },
        error,
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to fetch messages', loading: false });
    }
  },
}));