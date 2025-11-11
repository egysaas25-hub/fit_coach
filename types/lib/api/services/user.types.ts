/**
 * User Service Types
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