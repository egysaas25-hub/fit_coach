import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/lib/api/services/auth.service';
import { useUserStore } from '@/lib/store/user.store';
import { LoginDto } from '@/types/api/request/auth.dto';
import { User } from '@/types/domain/user.model';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  return useMutation<{ user: User; token: string }, Error, LoginDto>({
    mutationFn: ({ email, password, type }) => AuthService.prototype.login(email, password, type), // Updated to use AuthService
    onSuccess: ({ user, token }) => {
      setUser(user);
      queryClient.setQueryData(['user'], user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  return useMutation<void, Error, void>({
    mutationFn: AuthService.prototype.logout, // Updated to use AuthService
    onSuccess: () => {
      setUser(null);
      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });
};

// Optional: Add useAuth if needed
export const useAuth = () => {
  const login = useLogin();
  const logout = useLogout();
  return { login, logout };
};