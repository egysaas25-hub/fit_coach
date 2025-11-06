// lib/api/services/referral.service.ts
import { ReferralResponseDto, CreateReferralDto } from '@/types/api/referral.dto';
import { Referral } from '@/types/models/referral.model';
import { referralMapper } from '@/lib/mappers/referral.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const referralService = {
  getAll: async (customerId?: string): Promise<Referral[]> => {
    const url = customerId ? `${endpoints.referral}?customer_id=${customerId}` : endpoints.referral;
    const { data } = await apiClient.get<ReferralResponseDto[]>(url);
    return data.map(referralMapper.toModel);
  },
  create: async (model: Partial<Referral>): Promise<Referral> => {
    const dto = referralMapper.toCreateDto(model);
    const { data } = await apiClient.post<ReferralResponseDto>(endpoints.referral, dto);
    return referralMapper.toModel(data);
  },
};