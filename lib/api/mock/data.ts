// lib/api/mock/data.ts
import { ClientResponseDto } from '@/types/api/client.dto';
import { WorkoutResponseDto } from '@/types/api/workout.dto';
// Add other DTOs as needed

export const mockClients: ClientResponseDto[] = [
  {
    id: '1',
    tenant_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    phone_e164: '+1234567890',
    status: 'active',
    goal: 'Weight loss',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

export const mockWorkouts: WorkoutResponseDto[] = [
  {
    id: 1,
    tenant_id: 1,
    customer_id: '1',
    version: 1,
    is_active: true,
    split: 'Full body',
    notes: null,
    created_by: 1,
    created_at: '2025-01-01T00:00:00Z',
    training_plan_exercises: [],
  },
];
// Add mock data for other entities