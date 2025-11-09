// lib/hooks/api/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService, CreateUserDto, BulkUpdateUsersDto } from '@/lib/api/services/user.service';

const userService = new UserService();

/**
 * Hook for users list
 * Rule 1: Component calls hook
 * Rule 2: Hook calls service
 */
export const useUsers = (params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => userService.getUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Mutation: Create user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateUserDto) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

/**
 * Mutation: Bulk update users
 */
export const useBulkUpdateUsers = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: BulkUpdateUsersDto) => userService.bulkUpdateUsers(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};
