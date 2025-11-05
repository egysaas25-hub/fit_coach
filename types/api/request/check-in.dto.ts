export interface CreateCheckInDto {
  tenant_id: number;
  customer_id: string;
  team_member_id: string;
  status: string;
  notes?: string | null;
  check_in_date: string;
}

export interface UpdateCheckInDto {
  status?: string;
  notes?: string | null;
  check_in_date?: string;
}

export interface CheckInResponseDto {
  id: number;
  tenant_id: number;
  customer_id: string;
  team_member_id: string;
  status: string;
  notes: string | null;
  check_in_date: string;
  created_at: string;
}