import { TrainerResponseDto, CreateTrainerDto } from '@/types/api/trainer.dto';
import { Trainer, TeamMemberRole } from '@/types/models/trainer.model';

export const trainerMapper = {
  toModel: (dto: TrainerResponseDto): Trainer => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    fullName: `${dto.first_name || ''} ${dto.last_name || ''}`.trim(),
    email: dto.email,
    role: dto.role as TeamMemberRole,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
    initials: `${dto.first_name?.[0] || ''}${dto.last_name?.[0] || ''}`.toUpperCase(),
  }),
  toCreateDto: (model: Partial<Trainer>): CreateTrainerDto => ({
    tenant_id: model.tenantId!,
    first_name: model.firstName,
    last_name: model.lastName,
    email: model.email!,
    password: '', // Password handled separately
    role: model.role!,
  }),
};