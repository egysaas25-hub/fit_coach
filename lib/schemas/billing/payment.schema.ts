// lib/schemas/billing/payment.schema.ts
import { z } from 'zod';
import { idSchema, dateValidation } from '@/lib/schemas/common/common.schema';

export const createPaymentSchema = z.object({
  invoiceId: idSchema,
  amount: z.number().min(0, 'Amount must be positive'),
  method: z.enum(['Credit Card', 'PayPal', 'Bank Transfer', 'Crypto']),
  transactionId: z.string().min(1, 'Transaction ID is required'),
  paymentDate: dateValidation,
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

export const refundPaymentSchema = z.object({
  paymentId: idSchema,
  amount: z.number().min(0, 'Amount must be positive'),
  reason: z.string().min(1, 'Reason is required').max(500),
});

export const paymentFilterSchema = z.object({
  invoiceId: idSchema.optional(),
  method: z.enum(['Credit Card', 'PayPal', 'Bank Transfer', 'Crypto']).optional(),
  dateRange: z.object({
    startDate: dateValidation,
    endDate: dateValidation,
  }).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  }).optional(),
  status: z.enum(['Completed', 'Pending', 'Failed', 'Refunded']).optional(),
});