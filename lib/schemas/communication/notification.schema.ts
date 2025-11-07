// lib/schemas/communication/notification.schema.ts
import { z } from 'zod';
import { idSchema } from '@/lib/schemas/common/common.schema';

export const notificationPreferencesSchema = z.object({
  email: z.boolean().default(true),
  push: z.boolean().default(true),
  sms: z.boolean().default(false),
  types: z.array(z.enum(['system', 'billing', 'workout', 'nutrition'])).optional(),
});

export const createNotificationSchema = z.object({
  userId: idSchema,
  type: z.enum(['system', 'billing', 'workout', 'nutrition']),
  title: z.string().min(1, 'Title is required').max(100),
  message: z.string().min(1, 'Message is required').max(1000),
  data: z.record(z.string(), z.any()).optional(),
});