// lib/api/services/user.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';
import {
  AdminUser,
  UserListResponse,
  CreateUserDto,
  BulkUpdateUsersDto
} from '@/types/lib/api/services/user.types';

/**
 * User Service (Admin)
 * Rule 5: Service calls apiClient
 * Rule 6: Uses endpoints
 */

export class UserService {
  /**
   * Get all users with optional filters
   */
  async getUsers(params?: {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<UserListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${endpoints.admin.users}?${queryParams.toString()}`;
    const response = await apiClient.get<ApiResponse<UserListResponse>>(url);
    return response.data.data;
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserDto): Promise<AdminUser> {
    const response = await apiClient.post<ApiResponse<AdminUser>>(
      endpoints.admin.users,
      data
    );
    return response.data.data;
  }

  /**
   * Bulk update users
   */
  async bulkUpdateUsers(data: BulkUpdateUsersDto): Promise<{ updated: number; users: AdminUser[] }> {
    const response = await apiClient.patch<ApiResponse<{ updated: number; users: AdminUser[] }>>(
      endpoints.admin.users,
      data
    );
    return response.data.data;
  }
}
