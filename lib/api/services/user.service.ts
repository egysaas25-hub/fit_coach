// lib/api/services/user.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';

/**
 * User Service (Admin)
 * Rule 5: Service calls apiClient
 * Rule 6: Uses endpoints
 */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: string;
  password?: string;
}

export interface BulkUpdateUsersDto {
  userIds: string[];
  updates: Partial<AdminUser>;
}

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
