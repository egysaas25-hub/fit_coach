// lib/api/services/message.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';
import { MessageThread, MessageItem, ThreadsResponse } from '@/types/lib/api/services/message.types';

export const messageService = {
  async getThreads(params?: { page?: number; limit?: number }): Promise<ThreadsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    const url = `${endpoints.message}/threads?${queryParams.toString()}`;
    const response = await apiClient.get<ApiResponse<ThreadsResponse>>(url);
    return response.data.data;
  },

  async getMessages(threadId: string, params?: { limit?: number }): Promise<MessageItem[]> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', String(params.limit));
    queryParams.append('threadId', threadId);
    const url = `${endpoints.message}?${queryParams.toString()}`;
    const response = await apiClient.get<ApiResponse<MessageItem[]>>(url);
    return response.data.data;
  },

  async sendMessage(threadId: string, content: string): Promise<MessageItem> {
    const response = await apiClient.post<ApiResponse<MessageItem>>(endpoints.message, { threadId, content });
    return response.data.data;
  },
};
