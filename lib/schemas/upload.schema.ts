// lib/schemas/upload.schema.ts
import { z } from 'zod';
import { fileValidation } from '@/lib/schemas/common/validation-rules';

export const fileUploadSchema = z.object({
  file: fileValidation,
  type: z.enum(['image', 'document', 'video']),
  category: z.enum(['avatar', 'progress', 'exercise']).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const multipleFilesSchema = z.object({
  files: z.array(fileUploadSchema),
  type: z.enum(['image', 'document', 'video']),
  category: z.enum(['avatar', 'progress', 'exercise']).optional(),
});

export const imageSchema = z.object({
  file: fileValidation.refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
    message: 'File must be a JPEG or PNG image',
  }).refine((file) => file.size <= 10 * 1024 * 1024, {
    message: 'Image must be less than 10MB',
  }),
});

export const documentSchema = z.object({
  file: fileValidation.refine((file) => ['application/pdf'].includes(file.type), {
    message: 'File must be a PDF',
  }).refine((file) => file.size <= 20 * 1024 * 1024, {
    message: 'Document must be less than 20MB',
  }),
});