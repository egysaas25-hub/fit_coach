import { create } from 'zustand';
import { AITemplate, AILog } from '@/types/domain/ai';
import { useAITemplates, useAILogs } from '@/lib/hooks/api/useAI';


export const useAIStore = create<AIState>((set) => ({
  templates: [],
  logs: [],
  loading: false,
  error: null,
  fetchTemplates: async () => {
    set({ loading: true });
    try {
      const { templates, error } = await useAITemplates();
      set({ templates, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch AI templates', loading: false });
    }
  },
  fetchLogs: async () => {
    set({ loading: true });
    try {
      const { logs, error } = await useAILogs();
      set({ logs, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch AI logs', loading: false });
    }
  },
}));