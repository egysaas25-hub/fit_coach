// src/types/trainer.ts
export type TeamMemberRole = 'owner' | 'trainer' | 'admin'; // From team_member_role enum

export interface Trainer {
  id: string;
  tenant_id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: TeamMemberRole;
  created_at: string;
  updated_at: string;
}

export interface CreateTrainerDto {
  tenant_id: number;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  password: string;
  role: TeamMemberRole;
}

export interface UpdateTrainerDto {
  first_name?: string | null;
  last_name?: string | null;
  email?: string;
  role?: TeamMemberRole;
}