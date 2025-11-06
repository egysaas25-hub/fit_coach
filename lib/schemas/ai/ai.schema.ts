// lib/schemas/ai/ai.schema.ts
import { z } from 'zod';
import { idSchema, dateRangeSchema } from '@/lib/schemas/common/common.schema';
import { TemplateCategory } from '@/types/domain/ai';

export const aiPromptSchema = z.object({
  templateId: idSchema.optional(),
  variables: z.record(z.string(), z.any()).optional(),
  context: z.string().max(1000).optional(),
});

export const aiTemplateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  category: z.enum(Object.values(TemplateCategory) as [string, ...string[]]),
  prompt: z.string().min(1, 'Prompt is required'),
  variables: z.array(z.string()).optional(),
});

export const aiLogFilterSchema = z.object({
  status: z.enum(['Success', 'Error', 'Pending']).optional(),
  dateRange: dateRangeSchema,
  user: z.string().optional(),
});