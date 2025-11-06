// lib/schemas/integration.schema.ts
import { z } from 'zod';
import { idSchema, dateValidation } from '@/lib/schemas/common/common.schema';

export const integrationConfigSchema = z.object({
  type: z.enum(['Stripe', 'Google', 'Zoom', 'Slack']),
  credentials: z.record(z.string(), z.string()),
  settings: z.record(z.string(), z.any()).optional(),
});

export const syncSchema = z.object({
  integrationId: idSchema,
  dataType: z.enum(['users', 'subscriptions', 'workouts', 'nutrition']),
  lastSync: dateValidation,
});