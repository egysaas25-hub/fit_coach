// lib/schemas/scheduling/calendar.schema.ts
import { z } from 'zod';
import { idSchema, dateValidation } from '@/lib/schemas/common/common.schema';

export const calendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  startDateTime: dateValidation,
  endDateTime: dateValidation,
  type: z.enum(['Appointment', 'Availability', 'Blocked']),
  userId: idSchema.optional(),
  clientId: idSchema.optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
}).refine((data) => new Date(data.startDateTime) <= new Date(data.endDateTime), {
  message: 'End date must be after start date',
  path: ['endDateTime'],
});

export const calendarViewSchema = z.object({
  view: z.enum(['day', 'week', 'month']),
  date: dateValidation,
  userId: idSchema.optional(),
  filters: z.object({
    type: z.enum(['Appointment', 'Availability', 'Blocked']).optional(),
    clientId: idSchema.optional(),
  }).optional(),
});
