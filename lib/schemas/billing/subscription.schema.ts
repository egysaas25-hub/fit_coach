// lib/schemas/billing/subscription.schema.ts
import { z } from 'zod';
import { idSchema, dateValidation } from '@/lib/schemas/common/common.schema';
import { PaymentStatus } from '@/types/domain/subscription';

export const createSubscriptionSchema = z.object({
  clientId: idSchema,
  planId: idSchema,
  startDate: dateValidation,
  paymentMethod: z.enum(['Credit Card', 'PayPal', 'Bank Transfer']),
});

export const updateSubscriptionSchema = z.object({
  planId: idSchema.optional(),
  status: z.enum(Object.values(PaymentStatus) as [string, ...string[]]).optional(),
});

export const planSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  price: z.number().min(0, 'Price must be positive'),
  duration: z.number().min(1, 'Duration must be at least 1 month'),
  features: z.array(z.string().min(1)),
});

export const invoiceSchema = z.object({
  clientId: idSchema,
  amount: z.number().min(0, 'Amount must be positive'),
  items: z.array(z.object({
    description: z.string().min(1),
    amount: z.number().min(0),
  })),
  dueDate: dateValidation,
});

export const paymentSchema = z.object({
  invoiceId: idSchema,
  amount: z.number().min(0, 'Amount must be positive'),
  method: z.enum(['Credit Card', 'PayPal', 'Bank Transfer']),
  transactionId: z.string().min(1, 'Transaction ID is required'),
});