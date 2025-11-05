export interface CreateTrainerDto {
  tenant_id: number;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  password: string;
  role: string;
}

export interface UpdateTrainerDto {
  first_name?: string | null;
  last_name?: string | null;
  email?: string;
  role?: string;
}

export interface TrainerResponseDto {
  id: string;
  tenant_id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}