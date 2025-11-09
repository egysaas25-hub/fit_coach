// lib/hooks/api/useMessages.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService, ThreadsResponse, MessageItem } from '../../api/services/message.service';

export const useMessageThreads = (params?: { page?: number; limit?: number }) => {
  return useQuery<ThreadsResponse>({
    queryKey: ['messages', 'threads', params],
    queryFn: () => messageService.getThreads(params),
    staleTime: 120_000,
  });
};

export const useMessages = (threadId: string, params?: { limit?: number }) => {
  return useQuery<MessageItem[]>({
    queryKey: ['messages', threadId, params],
    queryFn: () => messageService.getMessages(threadId, params),
    staleTime: 60_000,
    enabled: !!threadId,
  });
};

export const useSendMessage = (threadId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => messageService.sendMessage(threadId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', threadId] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'threads'] });
    },
  });
};
