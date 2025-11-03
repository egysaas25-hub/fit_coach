export interface CreateAppointmentDto {
  tenant_id: number;
  customer_id: string;
  team_member_id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string | null;
}

export interface UpdateAppointmentDto {
  start_time?: string;
  end_time?: string;
  status?: string;
  notes?: string | null;
}

export interface AppointmentResponseDto {
  id: number;
  tenant_id: number;
  customer_id: string;
  team_member_id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}