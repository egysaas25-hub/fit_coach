export interface CreateClientDto {
  tenant_id: number;
  first_name?: string | null;
  last_name?: string | null;
  phone_e164: string;
  status: string;
  goal?: string | null;
}

export interface UpdateClientDto {
  first_name?: string | null;
  last_name?: string | null;
  status?: string;
  goal?: string | null;
}

export interface ClientResponseDto {
  id: string;
  tenant_id: number;
  first_name: string | null;
  last_name: string | null;
  phone_e164: string;
  status: string;
  goal: string | null;
  created_at: string;
  updated_at: string;
}