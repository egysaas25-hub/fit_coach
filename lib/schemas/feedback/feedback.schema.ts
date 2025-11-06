// lib/schemas/feedback/feedback.schema.ts
import { z } from 'zod';
import { idSchema, dateValidation } from '@/lib/schemas/common/common.schema';

export const createFeedbackSchema = z.object({
  userId: idSchema,
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(1, 'Comment is required').max(1000),
  category: z.enum(['Workout', 'Nutrition', 'Support', 'General']),
  submittedAt: dateValidation,
});

export const feedbackFilterSchema = z.object({
  userId: idSchema.optional(),
  category: z.enum(['Workout', 'Nutrition', 'Support', 'General']).optional(),
  rating: z.number().min(1).max(5).optional(),
  dateRange: z.object({
    startDate: dateValidation,
    endDate: dateValidation,
  }).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  }).optional(),
});