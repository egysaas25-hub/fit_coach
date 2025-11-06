// lib/api/services/message.service.ts
import { MessageResponseDto, CreateMessageDto, MessageThreadResponseDto } from '@/types/api/message.dto';
import { Message, MessageThread } from '@/types/models/message.model';
import { messageMapper } from '@/lib/mappers/message.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const messageService = {
  getThreads: async (customerId?: string): Promise<MessageThread[]> => {
    const url = customerId ? `${endpoints.message}/threads?customer_id=${customerId}` : `${endpoints.message}/threads`;
    const { data } = await apiClient.get<MessageThreadResponseDto[]>(url);
    return data.map(messageMapper.toThreadModel);
  },
  getAll: async (threadId: number): Promise<Message[]> => {
    const { data } = await apiClient.get<MessageResponseDto[]>(`${endpoints.message}?thread_id=${threadId}`);
    return data.map(messageMapper.toModel);
  },
  create: async (model: Partial<Message>): Promise<Message> => {
    const dto = messageMapper.toCreateDto(model);
    const { data } = await apiClient.post<MessageResponseDto>(endpoints.message, dto);
    return messageMapper.toModel(data);
  },
};