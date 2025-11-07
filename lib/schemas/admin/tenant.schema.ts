// lib/schemas/admin/tenant.schema.ts
import { z } from 'zod';
import { emailValidation, dateRangeSchema } from '@/lib/schemas/common/common.schema';

export const createTenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: emailValidation,
  plan: z.enum(['Basic', 'Pro', 'Enterprise']),
  users: z.array(z.string()).optional(),
});

export const updateTenantSchema = createTenantSchema.partial();

export const tenantStatsSchema = z.object({
  dateRange: dateRangeSchema,
});