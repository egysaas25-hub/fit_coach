// lib/schemas/common/common.schema.ts
import { z } from 'zod';
import { dateValidation } from '@/lib/schemas/common/validation-rules';

export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z.number().min(1, 'Limit must be at least 1').max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const dateRangeSchema = z.object({
  startDate: dateValidation,
  endDate: dateValidation,
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const idSchema = z.string().uuid('Invalid UUID');

export const searchSchema = z.object({
  query: z.string().optional(),
  filters: z.record(z.string(), z.any()).optional(),
});

export const sortSchema = z.object({
  field: z.string().min(1, 'Sort field is required'),
  order: z.enum(['asc', 'desc']),
});

export const bulkActionSchema = z.object({
  ids: z.array(idSchema),
  action: z.string().min(1, 'Action is required'),
});