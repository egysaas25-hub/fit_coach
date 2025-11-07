// lib/schemas/admin/audit.schema.ts
import { z } from 'zod';
import { idSchema, dateRangeSchema } from '@/lib/schemas/common/common.schema';
import { AuditAction } from '@/types/domain/audit';

export const auditLogSchema = z.object({
  userId: idSchema.optional(),
  action: z.enum(Object.values(AuditAction) as [string, ...string[]]),
  resource: z.string().min(1, 'Resource is required'),
  changes: z.record(z.string(), z.any()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const auditFilterSchema = z.object({
  dateRange: dateRangeSchema,
  userId: idSchema.optional(),
  action: z.enum(Object.values(AuditAction) as [string, ...string[]]).optional(),
  resource: z.string().optional(),
});