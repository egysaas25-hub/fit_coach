export type CustomerStatus =
  | 'lead'
  | 'active'
  | 'paused'
  | 'expired'
  | 'churned'
  | 'paid_pending_kyc'
  | 'lead_incomplete';

export interface Client {
  id: string;
  tenant_id: number;
  first_name: string | null;
  last_name: string | null;
  phone_e164: string;
  status: CustomerStatus;
  goal: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateClientDto {
  tenant_id: number;
  first_name?: string | null;
  last_name?: string | null;
  phone_e164: string;
  status: CustomerStatus;
  goal?: string | null;
}

export interface UpdateClientDto {
  first_name?: string | null;
  last_name?: string | null;
  status?: CustomerStatus;
  goal?: string | null;
}