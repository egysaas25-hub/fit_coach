import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/api/services/auth.service';
import { LoginDto, AuthResponseDto } from '@/types/api/auth.dto';
import { useAuthStore } from '@/lib/store/auth.store';

export const useAuth = () => {
  const { setUser, setToken } = useAuthStore();

  return useMutation<AuthResponseDto, Error, LoginDto>({
    mutationFn: (loginDto: LoginDto) => authService.login(loginDto),
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.access_token);
    },
  });
};