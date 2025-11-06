// lib/api/services/support.service.ts
import { Ticket, TicketStatus } from '@/types/domain/support';

export class SupportService {
  async getTickets(): Promise<Ticket[]> {
    try {
      const response = await fetch('/api/support/tickets');
      const data = await response.json();
      return data as Ticket[];
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw new Error('Failed to fetch tickets');
    }
  }

  async createTicket(ticket: Partial<Ticket>): Promise<Ticket> {
    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket),
      });
      const data = await response.json();
      return data as Ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw new Error('Failed to create ticket');
    }
  }

  async updateTicket(ticketId: string, updates: Partial<Ticket>): Promise<Ticket> {
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      return data as Ticket;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw new Error('Failed to update ticket');
    }
  }

  async getTicketStats(): Promise<{ open: number; inProgress: number; resolved: number; avgResponseTime: string }> {
    try {
      const response = await fetch('/api/support/tickets/stats');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
      throw new Error('Failed to fetch ticket stats');
    }
  }
}