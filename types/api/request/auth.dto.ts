export interface LoginDto {
  email: string;
  password: string;
  type: string;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    tenant_id: number;
    type: string;
    email: string | null;
    name: string | null;
  };
}