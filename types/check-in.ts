// src/types/check-in.ts
export type CheckInStatus = 'completed' | 'missed'; // From check_in_status enum

export interface CheckIn {
  id: number;
  tenant_id: number;
  customer_id: string;
  team_member_id: string;
  status: CheckInStatus;
  notes: string | null;
  check_in_date: string;
  created_at: string;
}

export interface CreateCheckInDto {
  tenant_id: number;
  customer_id: string;
  team_member_id: string;
  status: CheckInStatus;
  notes?: string | null;
  check_in_date: string;
}

export interface UpdateCheckInDto {
  status?: CheckInStatus;
  notes?: string | null;
  check_in_date?: string;
}