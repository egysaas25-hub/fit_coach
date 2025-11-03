// src/types/auth.ts
export type UserType = 'team_member' | 'customer';

export interface AuthUser {
  id: string;
  tenant_id: number;
  type: UserType;
  email: string | null;
  name: string | null;
}

export interface LoginDto {
  email: string;
  password: string;
  type: UserType;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}