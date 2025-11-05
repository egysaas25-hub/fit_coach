// lib/api/services/auth.service.ts
import { AuthResponseDto, LoginDto } from '@/types/api/auth.dto';
import { User } from '@/types/models/user.model';
import { authMapper } from '@/lib/mappers/auth.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const authService = {
  login: async (dto: LoginDto): Promise<{ user: User; token: string }> => {
    const { data } = await apiClient.post<AuthResponseDto>(endpoints.auth.login, dto);
    return { user: authMapper.toModel(data.user), token: data.access_token };
  },
  logout: async (): Promise<void> => {
    await apiClient.post(`${endpoints.auth}/logout`);
  },
};