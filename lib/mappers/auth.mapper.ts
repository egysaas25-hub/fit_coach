import { AuthResponseDto, LoginDto } from '@/types/api/auth.dto';
import { User, UserType } from '@/types/models/user.model';

export const authMapper = {
  toModel: (dto: AuthResponseDto['user']): User => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    type: dto.type as UserType,
    email: dto.email,
    name: dto.name,
    initials: dto.name ? dto.name.slice(0, 2).toUpperCase() : '',
  }),
  toLoginDto: (model: Partial<User>): LoginDto => ({
    email: model.email!,
    password: '', // Password handled separately
    type: model.type!,
  }),
};