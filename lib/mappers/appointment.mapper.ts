import { AppointmentResponseDto, CreateAppointmentDto } from '@/types/api/appointment.dto';
import { Appointment, AppointmentStatus } from '@/types/models/appointment.model';

export const appointmentMapper = {
  toModel: (dto: AppointmentResponseDto): Appointment => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    customerId: dto.customer_id,
    teamMemberId: dto.team_member_id,
    startTime: new Date(dto.start_time),
    endTime: new Date(dto.end_time),
    status: dto.status as AppointmentStatus,
    notes: dto.notes,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
    duration: (new Date(dto.end_time).getTime() - new Date(dto.start_time).getTime()) / (1000 * 60),
  }),
  toCreateDto: (model: Partial<Appointment>): CreateAppointmentDto => ({
    tenant_id: model.tenantId!,
    customer_id: model.customerId!,
    team_member_id: model.teamMemberId!,
    start_time: model.startTime!.toISOString(),
    end_time: model.endTime!.toISOString(),
    status: model.status!,
    notes: model.notes,
  }),
};