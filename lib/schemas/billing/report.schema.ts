// lib/schemas/billing/report.schema.ts
import { z } from 'zod';
import { dateRangeSchema } from '@/lib/schemas/common/common.schema';
import { ReportType } from '@/types/domain/report';

export const generateReportSchema = z.object({
  type: z.enum(Object.values(ReportType) as [string, ...string[]]),
  dateRange: dateRangeSchema,
  clientId: z.string().optional(),
  filters: z.record(z.string(), z.any()).optional(),
});

export const reportFilterSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  metrics: z.array(z.string()).optional(),
  groupBy: z.enum(['day', 'week', 'month']).optional(),
});

export const customReportSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(1000).optional(),
  metrics: z.array(z.string().min(1)),
  filters: z.record(z.string(), z.any()).optional(),
});