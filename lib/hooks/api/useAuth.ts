// hooks/api/useAuth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/types/models/user.model';
import { authService } from '@/lib/api/services/auth.service';
import { LoginDto } from '@/types/api/auth.dto';
import { useUserStore } from '@/lib/store/user.store';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  return useMutation<{ user: User; token: string }, Error, LoginDto>({
    mutationFn: authService.login,
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
    mutationFn: authService.logout,
    onSuccess: () => {
      setUser(null);
      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });
};