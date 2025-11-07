// lib/mappers/support.mapper.ts
import { Ticket, TicketPriority, TicketStatus, TicketCategory } from '@/types/domain/support';

interface RawTicket {
  ticket_id: string;
  subject: string;
  user_id: string;
  priority: string;
  status: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export class SupportMapper {
  static toDomainTicket(raw: RawTicket): Ticket {
    return {
      id: raw.ticket_id,
      subject: raw.subject,
      userId: raw.user_id,
      priority: raw.priority as TicketPriority,
      status: raw.status as TicketStatus,
      category: raw.category as TicketCategory,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }

  static toDomainTickets(rawTickets: RawTicket[]): Ticket[] {
    return rawTickets.map(this.toDomainTicket);
  }
}