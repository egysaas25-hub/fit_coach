import { WorkoutService } from '@/lib/api/services/workout.service';
import { useWorkouts } from '@/lib/hooks/api/useWorkouts';
import { Workout } from '@/types/domain/workout.model';

// Mock the apiClient
jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock the endpoints
jest.mock('@/lib/api/endpoints', () => ({
  endpoints: {
    workout: '/workouts',
  },
}));

describe('Workout Service', () => {
  let workoutService: WorkoutService;
  
  beforeEach(() => {
    workoutService = new WorkoutService();
    jest.clearAllMocks();
  });

  describe('getWorkouts', () => {
    it('should fetch all workouts', async () => {
      const mockWorkouts: Workout[] = [
        { 
          id: 1, 
          tenantId: 1, 
          customerId: '1', 
          version: 1, 
          isActive: true, 
          split: null, 
          notes: null, 
          createdBy: 1, 
          createdAt: new Date(), 
          trainingPlanExercises: [], 
          totalSets: 0, 
          totalExercises: 5 
        },
        { 
          id: 2, 
          tenantId: 1, 
          customerId: '2', 
          version: 1, 
          isActive: false, 
          split: null, 
          notes: null, 
          createdBy: 1, 
          createdAt: new Date(), 
          trainingPlanExercises: [], 
          totalSets: 0, 
          totalExercises: 3 
        },
      ];

      const mockResponse = {
        data: {
          data: mockWorkouts,
        },
      };

      const { apiClient } = require('@/lib/api/client');
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await workoutService.getWorkouts();

      expect(apiClient.get).toHaveBeenCalledWith('/workouts');
      expect(result).toEqual(mockWorkouts);
    });
  });

  describe('createWorkout', () => {
    it('should create a new workout', async () => {
      const newWorkout = {
        name: 'New Workout',
        isActive: true,
      };

      const mockCreatedWorkout = { 
        id: 3, 
        tenantId: 1, 
        customerId: '1', 
        version: 1, 
        isActive: true, 
        split: null, 
        notes: null, 
        createdBy: 1, 
        createdAt: new Date(), 
        trainingPlanExercises: [], 
        totalSets: 0, 
        totalExercises: 0 
      };

      const mockResponse = {
        data: {
          data: mockCreatedWorkout,
        },
      };

      const { apiClient } = require('@/lib/api/client');
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await workoutService.createWorkout(newWorkout);

      expect(apiClient.post).toHaveBeenCalledWith('/workouts', newWorkout);
      expect(result).toEqual(mockCreatedWorkout);
    });
  });
});

describe('useWorkouts Hook', () => {
  it('should call workout service getWorkouts method', async () => {
    const mockWorkouts: Workout[] = [
      { 
        id: 1, 
        tenantId: 1, 
        customerId: '1', 
        version: 1, 
        isActive: true, 
        split: null, 
        notes: null, 
        createdBy: 1, 
        createdAt: new Date(), 
        trainingPlanExercises: [], 
        totalSets: 0, 
        totalExercises: 5 
      },
      { 
        id: 2, 
        tenantId: 1, 
        customerId: '2', 
        version: 1, 
        isActive: false, 
        split: null, 
        notes: null, 
        createdBy: 1, 
        createdAt: new Date(), 
        trainingPlanExercises: [], 
        totalSets: 0, 
        totalExercises: 3 
      },
    ];

    // Mock the useQuery hook
    const mockUseQuery = jest.fn().mockReturnValue({
      data: mockWorkouts,
      isLoading: false,
      error: null,
    });

    jest.mock('@tanstack/react-query', () => ({
      useQuery: mockUseQuery,
    }));

    // Re-import after mocking
    const { useWorkouts } = require('@/lib/hooks/api/useWorkouts');
    
    const result = useWorkouts();
    
    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['workouts'],
      queryFn: expect.any(Function),
      staleTime: 300000,
    });
  });
});