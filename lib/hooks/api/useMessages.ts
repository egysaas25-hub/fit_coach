// hooks/api/useMessages.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Message, MessageThread } from '@/types/models/message.model';
import { messageService } from '@/lib/api/services/message.service';
import { CreateMessageDto } from '@/types/api/message.dto';

export const useMessageThreads = (customerId?: string) => {
  return useQuery<MessageThread[], Error>({
    queryKey: ['message-threads', customerId],
    queryFn: () => messageService.getThreads(customerId),
    enabled: !!customerId,
  });
};

export const useMessages = (threadId: number) => {
  return useQuery<Message[], Error>({
    queryKey: ['messages', threadId],
    queryFn: () => messageService.getAll(threadId),
    enabled: !!threadId,
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<Message, Error, Partial<Message>>({
    mutationFn: messageService.create,
    onSuccess: (_, { threadId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', threadId] });
    },
  });
};