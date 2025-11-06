// lib/schemas/communication/messaging.schema.ts
import { z } from 'zod';
import { idSchema, fileValidation } from '@/lib/schemas/common/common.schema';
import { FlagSeverity } from '@/types/domain/communication';

export const sendMessageSchema = z.object({
  recipientId: idSchema,
  content: z.string().min(1, 'Message content is required').max(1000),
  attachments: z.array(fileValidation).optional(),
});

export const conversationFilterSchema = z.object({
  status: z.enum(['open', 'closed', 'archived']).optional(),
  unread: z.boolean().optional(),
  search: z.string().optional(),
});

export const messageReactionSchema = z.object({
  messageId: idSchema,
  reaction: z.enum(['like', 'dislike', 'heart']),
});

export const flagMessageSchema = z.object({
  messageId: idSchema,
  severity: z.enum(Object.values(FlagSeverity) as [string, ...string[]]),
  reason: z.string().min(1, 'Reason is required').max(500),
});

export const commentSchema = z.object({
  messageId: idSchema,
  content: z.string().min(1, 'Comment content is required').max(500),
});