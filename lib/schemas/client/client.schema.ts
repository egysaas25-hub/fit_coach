import { z } from 'zod';
import { emailValidation, phoneValidation } from '@/lib/schemas/common/validation-rules';
import { idSchema } from '@/lib/schemas/common/common.schema';
import { ProgramGoal } from '@/types/domain/program';

export const createClientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: emailValidation,
  phone: phoneValidation.optional(),
  goal: z.enum(Object.values(ProgramGoal) as [string, ...string[]]),
  startWeight: z.number().min(0, 'Start weight must be positive').optional(),
  goalWeight: z.number().min(0, 'Goal weight must be positive').optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const clientGoalsSchema = z.object({
  goal: z.enum(Object.values(ProgramGoal) as [string, ...string[]]),
  targetDate: z.string().datetime(),
  metrics: z.record(z.string(), z.number().min(0)).optional(),
});

export const clientStatusSchema = z.object({
  status: z.enum(['Active', 'Inactive', 'On Hold']),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

export const clientSearchSchema = z.object({
  query: z.string().optional(),
  filters: z.object({
    status: z.enum(['Active', 'Inactive', 'On Hold']).optional(),
    goal: z.enum(Object.values(ProgramGoal) as [string, ...string[]]).optional(),
  }).optional(),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  }).optional(),
});

export const assignTrainerSchema = z.object({
  clientId: idSchema,
  trainerId: idSchema,
});