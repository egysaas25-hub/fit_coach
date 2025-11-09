// lib/api/services/support.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';
import { Ticket, TicketStatus } from '@/types/domain/support';

export class SupportService {
  async getTickets(): Promise<Ticket[]> {
    const response = await apiClient.get<ApiResponse<Ticket[]>>(`${endpoints.support}/tickets`);
    return response.data.data;
  }

  async createTicket(ticket: Partial<Ticket>): Promise<Ticket> {
    const response = await apiClient.post<ApiResponse<Ticket>>(`${endpoints.support}/tickets`, ticket);
    return response.data.data;
  }

  async updateTicket(ticketId: string, updates: Partial<Ticket>): Promise<Ticket> {
    const response = await apiClient.patch<ApiResponse<Ticket>>(`${endpoints.support}/tickets/${ticketId}`, updates);
    return response.data.data;
  }

  async getTicketStats(): Promise<{ open: number; inProgress: number; resolved: number; avgResponseTime: string }> {
    const response = await apiClient.get<ApiResponse<{ open: number; inProgress: number; resolved: number; avgResponseTime: string }>>(`${endpoints.support}/tickets/stats`);
    return response.data.data;
  }
}
