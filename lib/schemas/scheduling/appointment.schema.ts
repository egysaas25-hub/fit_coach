// lib/schemas/scheduling/appointment.schema.ts
import { z } from 'zod';
import { idSchema, dateValidation } from '@/lib/schemas/common/common.schema';

export const createAppointmentSchema = z.object({
  clientId: idSchema,
  date: dateValidation,
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  type: z.enum(['Consultation', 'Training', 'Follow-Up']),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  notes: z.string().max(1000).optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial().extend({
  status: z.enum(['Scheduled', 'Completed', 'Cancelled']).optional(),
});

export const appointmentFilterSchema = z.object({
  date: dateValidation.optional(),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled']).optional(),
  clientId: idSchema.optional(),
  type: z.enum(['Consultation', 'Training', 'Follow-Up']).optional(),
});

export const rescheduleSchema = z.object({
  appointmentId: idSchema,
  newDate: dateValidation,
  newTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  reason: z.string().max(500).optional(),
});