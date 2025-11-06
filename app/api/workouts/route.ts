
import { workoutMapper } from '@/lib/mappers/workout.mapper';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { Workout } from '@/types/domain/workout.model';
import { WorkoutResponseDto } from '@/types/api/request/workout.dto';

export const workoutService = {
  getAll: async (customerId?: string): Promise<Workout[]> => {
    const url = customerId ? `${endpoints.workout}?customer_id=${customerId}` : endpoints.workout;
    const { data } = await apiClient.get<WorkoutResponseDto[]>(url);
    return data.map(workoutMapper.toModel);
  },
  create: async (model: Partial<Workout>): Promise<Workout> => {
    const dto = workoutMapper.toCreateDto(model);
    const { data } = await apiClient.post<WorkoutResponseDto>(endpoints.workout, dto);
    return workoutMapper.toModel(data);
  },
};