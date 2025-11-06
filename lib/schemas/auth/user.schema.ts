// lib/schemas/auth/user.schema.ts
import { z } from 'zod';
import { emailValidation, phoneValidation, fileValidation } from '@/lib/schemas/common/validation-rules';

export const userProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: emailValidation,
  phone: phoneValidation.optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
});

export const userPreferencesSchema = z.object({
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.enum(['en', 'es', 'fr', 'de']).default('en'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
  }),
});

export const userAvatarSchema = z.object({
  file: fileValidation.refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
    message: 'Avatar must be a JPEG or PNG image',
  }).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'Avatar must be less than 5MB',
  }),
});