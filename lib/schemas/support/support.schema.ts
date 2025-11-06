// lib/schemas/support/support.schema.ts
import { z } from 'zod';
import { idSchema } from '@/lib/schemas/common/common.schema';
import { TicketPriority, TicketStatus, TicketCategory } from '@/types/domain/support';

export const createTicketSchema = z.object({
  subject: z.string().min(2, 'Subject must be at least 2 characters').max(100),
  userId: idSchema,
  priority: z.enum(Object.values(TicketPriority) as [string, ...string[]]),
  status: z.enum(Object.values(TicketStatus) as [string, ...string[]]).default('Open'),
  category: z.enum(Object.values(TicketCategory) as [string, ...string[]]),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
});

export const updateTicketSchema = createTicketSchema.partial().extend({
  status: z.enum(Object.values(TicketStatus) as [string, ...string[]]).optional(),
});

export const ticketFilterSchema = z.object({
  status: z.enum(Object.values(TicketStatus) as [string, ...string[]]).optional(),
  priority: z.enum(Object.values(TicketPriority) as [string, ...string[]]).optional(),
  category: z.enum(Object.values(TicketCategory) as [string, ...string[]]).optional(),
  userId: idSchema.optional(),
  search: z.string().optional(),
});