// lib/schemas/common/validation-rules.ts
import { z } from 'zod';

export const emailValidation = z.string().email('Invalid email address');

export const phoneValidation = z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number').optional();

export const passwordStrength = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const dateValidation = z.string().datetime('Invalid date format');

export const fileValidation = z.any()
  .refine((file) => file instanceof File, 'Must be a valid file')
  .refine((file) => file.size <= 50 * 1024 * 1024, 'File must be less than 50MB');

export const urlValidation = z.string().url('Invalid URL');

export const numericRange = (min: number, max: number) =>
  z.number().min(min, `Must be at least ${min}`).max(max, `Must not exceed ${max}`);

export const textLength = (min: number, max: number) =>
  z.string().min(min, `Must be at least ${min} characters`).max(max, `Must not exceed ${max} characters`);

export const customRegex = (regex: RegExp, message: string) =>
  z.string().regex(regex, message);