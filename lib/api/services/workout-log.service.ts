// lib/api/services/workout-log.service.ts
import { WorkoutLogResponseDto, CreateWorkoutLogDto } from '@/types/api/workout-log.dto';
import { WorkoutLog } from '@/types/models/workout-log.model';
import { workoutLogMapper } from '@/lib/mappers/workout-log.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export const workoutLogService = {
  getAll: async (customerId?: string): Promise<WorkoutLog[]> => {
    const url = customerId ? `${endpoints.workoutLog}?customer_id=${customerId}` : endpoints.workoutLog;
    const { data } = await apiClient.get<WorkoutLogResponseDto[]>(url);
    return data.map(workoutLogMapper.toModel);
  },
  create: async (model: Partial<WorkoutLog>): Promise<WorkoutLog> => {
    const dto = workoutLogMapper.toCreateDto(model);
    const { data } = await apiClient.post<WorkoutLogResponseDto>(endpoints.workoutLog, dto);
    return workoutLogMapper.toModel(data);
  },
};