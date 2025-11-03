// lib/api/services/appointment.service.ts
import { AppointmentResponseDto, CreateAppointmentDto } from '@/types/api/appointment.dto';
import { Appointment } from '@/types/models/appointment.model';
import { appointmentMapper } from '@/lib/mappers/appointment.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const appointmentService = {
  getAll: async (tenantId?: number): Promise<Appointment[]> => {
    const url = tenantId ? `${endpoints.appointment}?tenant_id=${tenantId}` : endpoints.appointment;
    const { data } = await apiClient.get<AppointmentResponseDto[]>(url);
    return data.map(appointmentMapper.toModel);
  },
  getById: async (id: number): Promise<Appointment> => {
    const { data } = await apiClient.get<AppointmentResponseDto>(`${endpoints.appointment}/${id}`);
    return appointmentMapper.toModel(data);
  },
  create: async (model: Partial<Appointment>): Promise<Appointment> => {
    const dto = appointmentMapper.toCreateDto(model);
    const { data } = await apiClient.post<AppointmentResponseDto>(endpoints.appointment, dto);
    return appointmentMapper.toModel(data);
  },
  update: async (id: number, model: Partial<Appointment>): Promise<Appointment> => {
    const dto = appointmentMapper.toCreateDto(model);
    const { data } = await apiClient.put<AppointmentResponseDto>(`${endpoints.appointment}/${id}`, dto);
    return appointmentMapper.toModel(data);
  },
};