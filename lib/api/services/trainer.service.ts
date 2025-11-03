// lib/api/services/trainer.service.ts
import { TrainerResponseDto, CreateTrainerDto } from '@/types/api/trainer.dto';
import { Trainer } from '@/types/models/trainer.model';
import { trainerMapper } from '@/lib/mappers/trainer.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const trainerService = {
  getAll: async (tenantId?: number): Promise<Trainer[]> => {
    const url = tenantId ? `${endpoints.trainer}?tenant_id=${tenantId}` : endpoints.trainer;
    const { data } = await apiClient.get<TrainerResponseDto[]>(url);
    return data.map(trainerMapper.toModel);
  },
  getById: async (id: string): Promise<Trainer> => {
    const { data } = await apiClient.get<TrainerResponseDto>(`${endpoints.trainer}/${id}`);
    return trainerMapper.toModel(data);
  },
  create: async (model: Partial<Trainer>): Promise<Trainer> => {
    const dto = trainerMapper.toCreateDto(model);
    const { data } = await apiClient.post<TrainerResponseDto>(endpoints.trainer, dto);
    return trainerMapper.toModel(data);
  },
  update: async (id: string, model: Partial<Trainer>): Promise<Trainer> => {
    const dto = trainerMapper.toCreateDto(model);
    const { data } = await apiClient.put<TrainerResponseDto>(`${endpoints.trainer}/${id}`, dto);
    return trainerMapper.toModel(data);
  },
};