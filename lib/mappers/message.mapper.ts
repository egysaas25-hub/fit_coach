import { MessageResponseDto, MessageThreadResponseDto, CreateMessageDto } from '@/types/api/message.dto';
import { Message, MessageThread, MessageStatus } from '@/types/models/message.model';

export const messageMapper = {
  toMessageModel: (dto: MessageResponseDto): Message => ({
    id: dto.id,
    threadId: dto.thread_id,
    senderId: dto.sender_id,
    senderType: dto.sender_type as 'team_member' | 'customer',
    content: dto.content,
    status: dto.status as MessageStatus,
    createdAt: new Date(dto.created_at),
  }),
  toThreadModel: (dto: MessageThreadResponseDto): MessageThread => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    customerId: dto.customer_id,
    teamMemberId: dto.team_member_id,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  }),
  toCreateDto: (model: Partial<Message>): CreateMessageDto => ({
    thread_id: model.threadId!,
    sender_id: model.senderId!,
    sender_type: model.senderType!,
    content: model.content!,
  }),
};