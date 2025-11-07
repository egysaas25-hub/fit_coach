import { z } from 'zod';
import { fileValidation, idSchema, dateValidation } from '@/lib/schemas/common/common.schema';

export const weightLogSchema = z.object({
  weight: z.number().min(0, 'Weight must be positive'),
  date: dateValidation,
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

export const measurementSchema = z.object({
  waist: z.number().min(0).optional(),
  hips: z.number().min(0).optional(),
  chest: z.number().min(0).optional(),
  arms: z.number().min(0).optional(),
  thighs: z.number().min(0).optional(),
  shoulders: z.number().min(0).optional(),
  date: dateValidation,
});

export const progressPhotoSchema = z.object({
  file: fileValidation.refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
    message: 'Photo must be a JPEG or PNG image',
  }).refine((file) => file.size <= 10 * 1024 * 1024, {
    message: 'Photo must be less than 10MB',
  }),
  type: z.enum(['Front', 'Side', 'Back']).optional(),
  date: dateValidation,
  notes: z.string().max(1000).optional(),
});

export const bodyCompositionSchema = z.object({
  bodyFat: z.number().min(0).max(100).optional(),
  muscleMass: z.number().min(0).optional(),
  date: dateValidation,
});

export const progressNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(1000),
  date: dateValidation,
  clientId: idSchema,
});