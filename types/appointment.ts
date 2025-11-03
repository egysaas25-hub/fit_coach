// src/types/appointment.ts
export type AppointmentStatus = 'scheduled' | 'completed' | 'canceled'; // From appointment_status enum

export interface Appointment {
  id: number;
  tenant_id: number;
  customer_id: string;
  team_member_id: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentDto {
  tenant_id: number;
  customer_id: string;
  team_member_id: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string | null;
}

export interface UpdateAppointmentDto {
  start_time?: string;
  end_time?: string;
  status?: AppointmentStatus;
  notes?: string | null;
}