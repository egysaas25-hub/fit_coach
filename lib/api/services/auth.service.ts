// lib/api/services/auth.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto, AuthResponseDto } from '@/types/api/request/auth.dto';
import { User } from '@/types/domain/user.model';
import { authMapper } from '@/lib/mappers/auth.mapper';
import { ApiResponse } from '@/types/shared/response';

export class AuthService {
  /**
   * Login user
   * Rule 5: Service calls apiClient (lib/api/client.ts)
   * Rule 6: Uses endpoints from lib/api/endpoints.ts
   * Rule 3: Uses mapper to transform DTO to domain model
   */
  async login(data: LoginDto): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<ApiResponse<AuthResponseDto>>(
      endpoints.auth.login,
      data
    );
    const { token, user: userDto } = response.data.data;
    const user = authMapper.toModel(userDto);
    return { user, token };
  }

  /**
   * Register new user
   * Rule 5: Service calls apiClient
   * Rule 6: Uses endpoints
   * Rule 3: Uses mapper
   */
  async register(data: RegisterDto): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<ApiResponse<AuthResponseDto>>(
      endpoints.auth.register,
      data
    );
    const { token, user: userDto } = response.data.data;
    const user = authMapper.toModel(userDto);
    return { user, token };
  }

  /**
   * Request password reset
   * Rule 5: Service calls apiClient
   */
  async forgotPassword(data: ForgotPasswordDto): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      endpoints.auth.forgotPassword,
      data
    );
    return response.data.data;
  }

  /**
   * Reset password with token
   * Rule 5: Service calls apiClient
   */
  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      endpoints.auth.resetPassword,
      data
    );
    return response.data.data;
  }

  /**
   * Logout user
   * Rule 5: Service calls apiClient
   */
  async logout(): Promise<void> {
    await apiClient.post(endpoints.auth.logout);
  }

  /**
   * Get current authenticated user
   * Rule 5: Service calls apiClient
   * Rule 3: Uses mapper
   */
  async requestOtp(data: { phone: string; countryCode: string }): Promise<{ message: string; ttlSeconds: number }> {
    const response = await apiClient.post<ApiResponse<{ message: string; ttlSeconds: number }>>(
      endpoints.auth.requestOtp,
      data
    );
    return response.data.data;
  }

  async verifyOtp(data: { phone: string; countryCode: string; code: string; role?: string }): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<ApiResponse<{ token: string; user: any }>>(
      endpoints.auth.verifyOtp,
      data
    );
    const { token, user: userDto } = response.data.data;
    const user = authMapper.toModel(userDto);
    return { user, token };
  }

  // Restored: getCurrentUser
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<ApiResponse<AuthResponseDto['user']>>(
        endpoints.auth.currentUser
      );
      return authMapper.toModel(response.data.data);
    } catch (error) {
      return null;
    }
  }
}
