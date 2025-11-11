// lib/api/services/support.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { 
  SupportTicket,
  SupportMessage,
  SupportCategory
} from '@/types/domain/support';
import { ApiResponse } from '@/types/shared/response';

/**
 * Support Service
 * Rule 5: Service calls apiClient
 * Rule 6: Uses endpoints
 */
export class SupportService {
  /**
   * Get all support tickets
   */
  async getTickets(): Promise<SupportTicket[]> {
    const response = await apiClient.get<ApiResponse<SupportTicket[]>>(
      endpoints.admin.support.tickets
    );
    return response.data.data;
  }

  /**
   * Get ticket by ID
   */
  async getTicketById(id: string): Promise<SupportTicket> {
    const response = await apiClient.get<ApiResponse<SupportTicket>>(
      `${endpoints.admin.support.tickets}/${id}`
    );
    return response.data.data;
  }

  /**
   * Create a new support ticket
   */
  async createTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupportTicket> {
    const response = await apiClient.post<ApiResponse<SupportTicket>>(
      endpoints.admin.support.tickets,
      ticket
    );
    return response.data.data;
  }

  /**
   * Update a support ticket
   */
  async updateTicket(id: string, ticket: Partial<SupportTicket>): Promise<SupportTicket> {
    const response = await apiClient.put<ApiResponse<SupportTicket>>(
      `${endpoints.admin.support.tickets}/${id}`,
      ticket
    );
    return response.data.data;
  }

  /**
   * Get support categories
   */
  async getCategories(): Promise<SupportCategory[]> {
    const response = await apiClient.get<ApiResponse<SupportCategory[]>>(
      endpoints.admin.support.categories
    );
    return response.data.data;
  }

  /**
   * Get messages for a ticket
   */
  async getTicketMessages(ticketId: string): Promise<SupportMessage[]> {
    const response = await apiClient.get<ApiResponse<SupportMessage[]>>(
      `${endpoints.admin.support.tickets}/${ticketId}/messages`
    );
    return response.data.data;
  }

  /**
   * Add a message to a ticket
   */
  async addMessage(ticketId: string, message: Omit<SupportMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupportMessage> {
    const response = await apiClient.post<ApiResponse<SupportMessage>>(
      `${endpoints.admin.support.tickets}/${ticketId}/messages`,
      message
    );
    return response.data.data;
  }
}