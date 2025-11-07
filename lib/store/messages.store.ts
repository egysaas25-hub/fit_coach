// lib/store/messages.store.ts
import { create } from 'zustand';
import {
  Message,
  MessageThread,
  MessageState,
} from '@/types/domain/message.model';
import { messageService } from '@/lib/api/services/message.service';

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