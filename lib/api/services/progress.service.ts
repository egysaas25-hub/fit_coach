// lib/api/services/progress.service.ts
import { ProgressEntryResponseDto, ProgressChartResponseDto } from '@/types/api/progress.dto';
import { ProgressEntry, ProgressChart } from '@/types/models/progress.model';
import { progressMapper } from '@/lib/mappers/progress.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const progressService = {
  getEntries: async (customerId?: string): Promise<ProgressEntry[]> => {
    const url = customerId ? `${endpoints.progress}?customer_id=${customerId}` : endpoints.progress;
    const { data } = await apiClient.get<ProgressEntryResponseDto[]>(url);
    return data.map(progressMapper.toEntryModel);
  },
  getChartData: async (customerId: string, category: string): Promise<ProgressChart> => {
    const { data } = await apiClient.get<ProgressChartResponseDto>(`${endpoints.progress}/chart?customer_id=${customerId}&category=${category}`);
    return progressMapper.toChartModel(data);
  },
};