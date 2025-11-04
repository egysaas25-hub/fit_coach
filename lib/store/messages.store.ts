// lib/store/messages.store.ts
import { create } from 'zustand';
import { Message, MessageThread } from '@/types/models/message.model';
import { messageService } from '@/lib/api/services/message.service';

interface MessageState {
  threads: MessageThread[];
  messages: Message[];
  selectedThread: MessageThread | null;
  fetchThreads: (customerId?: string) => Promise<void>;
  fetchMessages: (threadId: number) => Promise<void>;
  setSelectedThread: (thread: MessageThread | null) => void;
}

export const useMessagesStore = create<MessageState>((set) => ({
  threads: [],
  messages: [],
  selectedThread: null,
  fetchThreads: async (customerId?: string) => {
    const threads = await messageService.getThreads(customerId);
    set({ threads });
  },
  fetchMessages: async (threadId: number) => {
    const messages = await messageService.getMessages(threadId);
    set({ messages });
  },
  setSelectedThread: (selectedThread) => set({ selectedThread }),
}));