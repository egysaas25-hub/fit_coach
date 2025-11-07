// lib/schemas/admin/settings.schema.ts
import { z } from 'zod';
import { emailValidation } from '@/lib/schemas/common/validation-rules';

export const generalSettingsSchema = z.object({
  platformName: z.string().min(2, 'Platform name must be at least 2 characters').max(100),
  email: emailValidation,
  timezone: z.string().min(1, 'Timezone is required'),
  maintenance: z.boolean().default(false),
});

export const notificationSettingsSchema = z.object({
  emailEnabled: z.boolean().default(true),
  smsEnabled: z.boolean().default(false),
  pushEnabled: z.boolean().default(true),
  weeklyReports: z.boolean().default(true),
});

export const securitySettingsSchema = z.object({
  twoFactor: z.boolean().default(false),
  sessionTimeout: z.number().min(5, 'Session timeout must be at least 5 minutes'),
  loginNotifications: z.boolean().default(true),
});

export const apiSettingsSchema = z.object({
  rateLimit: z.number().min(1, 'Rate limit must be at least 1 request per second'),
  logging: z.boolean().default(true),
});