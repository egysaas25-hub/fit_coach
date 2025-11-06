// lib/schemas/scheduling/availability.schema.ts
import { z } from 'zod';
import { dateValidation } from '@/lib/schemas/common/common.schema';

export const availabilitySchema = z.object({
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time must be in HH:MM format'),
  isAvailable: z.boolean().default(true),
});

export const blockTimeSchema = z.object({
  startDateTime: dateValidation,
  endDateTime: dateValidation,
  reason: z.string().max(500).optional(),
});