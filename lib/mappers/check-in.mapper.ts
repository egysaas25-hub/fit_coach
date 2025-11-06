import { CheckInResponseDto, CreateCheckInDto } from '@/types/api/check-in.dto';
import { CheckIn, CheckInStatus } from '@/types/models/check-in.model';

export const checkInMapper = {
  toModel: (dto: CheckInResponseDto): CheckIn => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    customerId: dto.customer_id,
    teamMemberId: dto.team_member_id,
    status: dto.status as CheckInStatus,
    notes: dto.notes,
    checkInDate: new Date(dto.check_in_date),
    createdAt: new Date(dto.created_at),
  }),
  toCreateDto: (model: Partial<CheckIn>): CreateCheckInDto => ({
    tenant_id: model.tenantId!,
    customer_id: model.customerId!,
    team_member_id: model.teamMemberId!,
    status: model.status!,
    notes: model.notes,
    check_in_date: model.checkInDate!.toISOString(),
  }),
};