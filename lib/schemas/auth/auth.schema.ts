import { z } from 'zod';
import { emailValidation, phoneValidation, passwordStrength } from '@/lib/schemas/common/validation-rules';

export const loginSchema = z.object({
  email: emailValidation,
  password: passwordStrength,
  type: z.enum(['email', 'phone', 'social']).optional(),
});

export const registerSchema = z.object({
  email: emailValidation,
  password: passwordStrength,
  confirmPassword: z.string().min(1, 'Confirm password is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: phoneValidation.optional(),
  role: z.enum(['admin', 'trainer', 'client']).optional(), // Add role to schema
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

export const apiRegisterSchema = z.object({
  email: emailValidation,
  password: passwordStrength,
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: phoneValidation.optional(),
  role: z.enum(['admin', 'trainer', 'client']).optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailValidation,
});

export const resetPasswordSchema = z.object({
  password: passwordStrength,
  confirmPassword: z.string().min(1, 'Confirm password is required'),
  token: z.string().min(1, 'Reset token is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordStrength,
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'New passwords must match',
  path: ['confirmPassword'],
});

export const whatsappLoginSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required').regex(/^\+\d+$/, 'Invalid country code'),
  phoneNumber: phoneValidation,
});

export const otpVerificationSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
  sessionId: z.string().min(1, 'Session ID is required'),
});

export const roleSelectionSchema = z.object({
  role: z.enum(['admin', 'trainer', 'client']),
});