// lib/api/services/check-in.service.ts
import { CheckInResponseDto, CreateCheckInDto } from '@/types/api/check-in.dto';
import { CheckIn } from '@/types/models/check-in.model';
import { checkInMapper } from '@/lib/mappers/check-in.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const checkInService = {
  getAll: async (customerId?: string): Promise<CheckIn[]> => {
    const url = customerId ? `${endpoints.checkIn}?customer_id=${customerId}` : endpoints.checkIn;
    const { data } = await apiClient.get<CheckInResponseDto[]>(url);
    return data.map(checkInMapper.toModel);
  },
  create: async (model: Partial<CheckIn>): Promise<CheckIn> => {
    const dto = checkInMapper.toCreateDto(model);
    const { data } = await apiClient.post<CheckInResponseDto>(endpoints.checkIn, dto);
    return checkInMapper.toModel(data);
  },
};