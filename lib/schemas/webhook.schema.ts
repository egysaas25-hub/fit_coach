// lib/schemas/webhook.schema.ts
import { z } from 'zod';
import { urlValidation } from '@/lib/schemas/common/validation-rules';

export const createWebhookSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  url: urlValidation,
  events: z.array(z.string().min(1)),
  headers: z.record(z.string(), z.string()).optional(),
});

export const webhookEventSchema = z.object({
  event: z.string().min(1, 'Event type is required'),
  payload: z.record(z.string(), z.any()),
});