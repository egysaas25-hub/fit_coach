import { ClientResponseDto, CreateClientDto } from '@/types/api/client.dto';
import { Client, CustomerStatus } from '@/types/models/client.model';

export const clientMapper = {
  toModel: (dto: ClientResponseDto): Client => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    fullName: `${dto.first_name || ''} ${dto.last_name || ''}`.trim(),
    phone: dto.phone_e164,
    status: dto.status as CustomerStatus,
    goal: dto.goal,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
    initials: `${dto.first_name?.[0] || ''}${dto.last_name?.[0] || ''}`.toUpperCase(),
  }),
  toCreateDto: (model: Partial<Client>): CreateClientDto => ({
    tenant_id: model.tenantId!,
    first_name: model.firstName,
    last_name: model.lastName,
    phone_e164: model.phone!,
    status: model.status!,
    goal: model.goal,
  }),
};