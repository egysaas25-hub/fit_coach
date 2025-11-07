// lib/schemas/workout/exercise.schema.ts
import { z } from 'zod';
import { urlValidation } from '@/lib/schemas/common/validation-rules';

export const createExerciseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  category: z.enum(['Strength', 'Cardio', 'Flexibility', 'Core']),
  equipment: z.string().max(100).optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  instructions: z.string().max(1000).optional(),
  videoUrl: urlValidation.optional(),
});

export const exerciseFilterSchema = z.object({
  category: z.enum(['Strength', 'Cardio', 'Flexibility', 'Core']).optional(),
  equipment: z.string().optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
});