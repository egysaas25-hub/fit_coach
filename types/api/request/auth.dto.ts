export interface LoginDto {
  email: string;
  password: string;
  type: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: string;
  role?: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  password: string;
  confirmPassword: string;
  token: string;
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