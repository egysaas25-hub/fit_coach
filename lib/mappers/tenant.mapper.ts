import { Tenant } from '@/types/models/tenant.model';

export const tenantMapper = {
  toModel: (dto: any): Tenant => ({
    id: dto.id,
    name: dto.name,
    domain: dto.domain,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  }),
};