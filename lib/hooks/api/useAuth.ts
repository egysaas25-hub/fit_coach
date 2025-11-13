import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/lib/api/services/auth.service';
import { useUserStore } from '@/lib/store/user.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from '@/types/api/request/auth.dto';
import { tenantService } from '@/lib/api/services/tenant.service';

const authService = new AuthService();

/**
 * Hook for login mutation
 * Rule 1: Components call hooks
 * Rule 2: Hooks call services (not other hooks or stores)
 * Uses React Query for server state management
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const { setToken } = useAuthStore();
  
  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: ({ user, token }) => {
      // Update stores with successful login data
      setUser(user);
      setToken(token);
      // Cache user in React Query
      queryClient.setQueryData(['user'], user);
    },
  });
};

/**
 * Hook for register mutation
 * Rule 1: Components call hooks
 * Rule 2: Hooks call services
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const { setToken } = useAuthStore();
  
  return useMutation({
    mutationFn: async (data: RegisterDto) => {
      try {
        console.log('Attempting to register with data:', data);
        const result = await authService.register(data);
        console.log('Registration successful:', result);
        return result;
      } catch (error) {
        console.error('Registration service error:', error);
        throw error;
      }
    },
    onSuccess: ({ user, token }) => {
      setUser(user);
      setToken(token);
      queryClient.setQueryData(['user'], user);
    },
    onError: (error) => {
      console.error('Registration hook error:', error);
    }
  });
};

/**
 * Hook for forgot password mutation
 * Rule 2: Hooks call services
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordDto) => authService.forgotPassword(data),
  });
};

/**
 * Hook for reset password mutation
 * Rule 2: Hooks call services
 */
export const useRequestOtp = () => {
  return useMutation({
    mutationFn: (data: { phone: string; countryCode: string }) => authService.requestOtp(data),
  });
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const { setToken } = useAuthStore();
  return useMutation({
    mutationFn: (data: { phone: string; countryCode: string; code: string; role?: string; name?: string; email?: string; workspaceName?: string }) => authService.verifyOtp(data),
    onSuccess: ({ user, token }) => {
      setUser(user);
      setToken(token);
      queryClient.setQueryData(['user'], user);
    },
  });
};

export const useRegisterWithOtp = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const { setToken } = useAuthStore();
  
  return useMutation({
    mutationFn: async (data: { 
      phone: string; 
      countryCode: string; 
      code: string;
      name: string;
      email?: string;
      workspaceName: string;
    }) => {
      // Just call verifyOtp with all registration data
      // The backend already handles registration
      return await authService.verifyOtp({
        phone: data.phone,
        countryCode: data.countryCode,
        code: data.code,
        name: data.name,
        email: data.email,
        workspaceName: data.workspaceName,
        role: 'admin' // or whatever role for new workspace owner
      });
    },
    onSuccess: ({ user, token }) => {
      setUser(user);
      setToken(token);
      queryClient.setQueryData(['user'], user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const { clearAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear user state
      setUser(null);
      clearAuth();
      // Clear all cached queries
      queryClient.clear();
    },
  });
};

/**
 * Hook for fetching current user (query)
 * Rule 2: Hooks call services
 */
export const useCurrentUser = () => {
  const { setUser } = useUserStore();
  
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        setUser(user);
      }
      return user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTenants = () => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: () => tenantService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
};