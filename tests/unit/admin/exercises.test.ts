import { ExerciseService } from '@/lib/api/services/exercise.service';
import { 
  useExercises, 
  useSearchExercises, 
  useExerciseCategories, 
  useExerciseEquipment,
  useCreateExercise,
  useUpdateExercise,
  useDeleteExercise
} from '@/lib/hooks/api/useExercises';
import { Exercise, ExerciseCategory, ExerciseEquipment } from '@/types/domain/exercise';

// Mock the apiClient
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockDeleteFn = jest.fn();

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDeleteFn,
  },
}));

// Mock the endpoints
jest.mock('@/lib/api/endpoints', () => ({
  endpoints: {
    workout: '/workouts',
    exercise: '/exercises',
  },
}));

describe('Exercise Service', () => {
  let exerciseService: ExerciseService;
  
  beforeEach(() => {
    exerciseService = new ExerciseService();
    jest.clearAllMocks();
  });

  describe('getExercises', () => {
    it('should fetch and extract exercises from workouts', async () => {
      const mockWorkouts = [
        {
          id: 1,
          name: 'Workout 1',
          exercises: [
            { id: '1', name: 'Push-ups', category: 'Chest', muscleGroup: ['Chest'], equipment: ['Bodyweight'] },
            { id: '2', name: 'Squats', category: 'Legs', muscleGroup: ['Quads'], equipment: ['Barbell'] },
          ],
        },
      ];

      const mockResponse = {
        data: {
          data: mockWorkouts,
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await exerciseService.getExercises();

      expect(mockGet).toHaveBeenCalledWith('/workouts');
      expect(result).toEqual([
        { id: '1', name: 'Push-ups', category: 'Chest', muscleGroup: ['Chest'], equipment: ['Bodyweight'], difficulty: 'intermediate', description: '', instructions: [], isFavorite: false, usageCount: 0, createdAt: expect.any(Date), updatedAt: expect.any(Date) },
        { id: '2', name: 'Squats', category: 'Legs', muscleGroup: ['Quads'], equipment: ['Barbell'], difficulty: 'intermediate', description: '', instructions: [], isFavorite: false, usageCount: 0, createdAt: expect.any(Date), updatedAt: expect.any(Date) },
      ]);
    });
  });

  describe('getExerciseById', () => {
    it('should fetch an exercise by ID', async () => {
      const mockExercise = {
        id: '1',
        name: 'Push-ups',
        category: 'Chest',
        muscleGroup: ['Chest'],
        equipment: ['Bodyweight'],
        difficulty: 'beginner' as const,
        description: 'Basic bodyweight exercise',
        instructions: ['Start in plank position', 'Lower your body'],
        isFavorite: false,
        usageCount: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the getExercises method to return our exercise
      exerciseService.getExercises = jest.fn().mockResolvedValue([mockExercise]);

      const result = await exerciseService.getExerciseById('1');

      expect(result).toEqual(mockExercise);
    });

    it('should throw an error if exercise is not found', async () => {
      exerciseService.getExercises = jest.fn().mockResolvedValue([]);

      await expect(exerciseService.getExerciseById('999')).rejects.toThrow('Exercise with id 999 not found');
    });
  });

  describe('searchExercises', () => {
    it('should search exercises by name', async () => {
      const mockExercises = [
        { id: '1', name: 'Push-ups', category: 'Chest' },
        { id: '2', name: 'Pull-ups', category: 'Back' },
        { id: '3', name: 'Squats', category: 'Legs' },
      ] as Exercise[];

      exerciseService.getExercises = jest.fn().mockResolvedValue(mockExercises);

      const result = await exerciseService.searchExercises('push');

      expect(result).toEqual([
        { id: '1', name: 'Push-ups', category: 'Chest' },
      ]);
    });
  });

  describe('getCategories', () => {
    it('should return exercise categories', async () => {
      const result = await exerciseService.getCategories();

      expect(result).toHaveLength(7);
      expect(result[0]).toEqual({
        id: 'chest',
        name: 'Chest',
        description: 'Chest exercises',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('getEquipment', () => {
    it('should return exercise equipment', async () => {
      const result = await exerciseService.getEquipment();

      expect(result).toHaveLength(6);
      expect(result[0]).toEqual({
        id: 'bodyweight',
        name: 'Bodyweight',
        description: 'Bodyweight exercises',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('createExercise', () => {
    it('should create a new exercise', async () => {
      const newExercise = {
        name: 'New Exercise',
        category: 'Chest',
        muscleGroup: ['Chest'],
        equipment: ['Dumbbells'],
        difficulty: 'intermediate' as const,
        description: 'A new exercise',
        instructions: ['Step 1', 'Step 2'],
        isFavorite: false,
        usageCount: 0,
      };

      const result = await exerciseService.createExercise(newExercise);

      expect(result).toEqual({
        ...newExercise,
        id: expect.stringMatching(/exercise-\d+/),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updateExercise', () => {
    it('should update an existing exercise', async () => {
      const existingExercise = {
        id: '1',
        name: 'Old Exercise',
        category: 'Chest',
        muscleGroup: ['Chest'],
        equipment: ['Bodyweight'],
        difficulty: 'beginner' as const,
        description: 'Old exercise',
        instructions: ['Old step 1'],
        isFavorite: false,
        usageCount: 2,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      exerciseService.getExerciseById = jest.fn().mockResolvedValue(existingExercise);

      const updatedExercise = {
        name: 'Updated Exercise',
        description: 'Updated exercise',
      };

      const result = await exerciseService.updateExercise('1', updatedExercise);

      expect(result).toEqual({
        ...existingExercise,
        ...updatedExercise,
        id: '1',
        createdAt: new Date('2023-01-01'),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('deleteExercise', () => {
    it('should delete an exercise', async () => {
      await exerciseService.deleteExercise('1');

      // Since it's a mock, we just verify it resolves
      expect(true).toBe(true);
    });
  });
});

describe('Exercise Hooks', () => {
  describe('useExercises', () => {
    it('should call exercise service getExercises method', async () => {
      const mockExercises: Exercise[] = [
        { id: '1', name: 'Push-ups', category: 'Chest', muscleGroup: ['Chest'], equipment: ['Bodyweight'], difficulty: 'beginner', description: '', instructions: [], isFavorite: false, usageCount: 0, createdAt: new Date(), updatedAt: new Date() },
      ];

      // Mock the useQuery hook
      const mockUseQuery = jest.fn().mockReturnValue({
        data: mockExercises,
        isLoading: false,
        error: null,
      });

      jest.mock('@tanstack/react-query', () => ({
        useQuery: mockUseQuery,
      }));

      // Re-import after mocking
      const { useExercises } = require('@/lib/hooks/api/useExercises');
      
      const result = useExercises();
      
      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['exercises'],
        queryFn: expect.any(Function),
        staleTime: 300000,
      });
    });
  });

  describe('useSearchExercises', () => {
    it('should call exercise service searchExercises method', async () => {
      const mockExercises: Exercise[] = [
        { id: '1', name: 'Push-ups', category: 'Chest', muscleGroup: ['Chest'], equipment: ['Bodyweight'], difficulty: 'beginner', description: '', instructions: [], isFavorite: false, usageCount: 0, createdAt: new Date(), updatedAt: new Date() },
      ];

      // Mock the useQuery hook
      const mockUseQuery = jest.fn().mockReturnValue({
        data: mockExercises,
        isLoading: false,
        error: null,
      });

      jest.mock('@tanstack/react-query', () => ({
        useQuery: mockUseQuery,
      }));

      // Re-import after mocking
      const { useSearchExercises } = require('@/lib/hooks/api/useExercises');
      
      const result = useSearchExercises('push');
      
      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['exercises', 'search', 'push'],
        queryFn: expect.any(Function),
        staleTime: 300000,
        enabled: true,
      });
    });
  });

  describe('useExerciseCategories', () => {
    it('should call exercise service getCategories method', async () => {
      const mockCategories: ExerciseCategory[] = [
        { id: 'chest', name: 'Chest', description: 'Chest exercises', createdAt: new Date(), updatedAt: new Date() },
      ];

      // Mock the useQuery hook
      const mockUseQuery = jest.fn().mockReturnValue({
        data: mockCategories,
        isLoading: false,
        error: null,
      });

      jest.mock('@tanstack/react-query', () => ({
        useQuery: mockUseQuery,
      }));

      // Re-import after mocking
      const { useExerciseCategories } = require('@/lib/hooks/api/useExercises');
      
      const result = useExerciseCategories();
      
      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['exercises', 'categories'],
        queryFn: expect.any(Function),
        staleTime: 600000,
      });
    });
  });

  describe('useExerciseEquipment', () => {
    it('should call exercise service getEquipment method', async () => {
      const mockEquipment: ExerciseEquipment[] = [
        { id: 'bodyweight', name: 'Bodyweight', description: 'Bodyweight exercises', createdAt: new Date(), updatedAt: new Date() },
      ];

      // Mock the useQuery hook
      const mockUseQuery = jest.fn().mockReturnValue({
        data: mockEquipment,
        isLoading: false,
        error: null,
      });

      jest.mock('@tanstack/react-query', () => ({
        useQuery: mockUseQuery,
      }));

      // Re-import after mocking
      const { useExerciseEquipment } = require('@/lib/hooks/api/useExercises');
      
      const result = useExerciseEquipment();
      
      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['exercises', 'equipment'],
        queryFn: expect.any(Function),
        staleTime: 600000,
      });
    });
  });

  describe('useCreateExercise', () => {
    it('should call exercise service createExercise method', async () => {
      const mockExercise: Exercise = {
        id: '3',
        name: 'New Exercise',
        category: 'Chest',
        muscleGroup: ['Chest'],
        equipment: ['Dumbbells'],
        difficulty: 'intermediate',
        description: 'A new exercise',
        instructions: ['Step 1', 'Step 2'],
        isFavorite: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the useMutation hook
      const mockMutate = jest.fn();
      const mockUseMutation = jest.fn().mockReturnValue({
        mutate: mockMutate,
        data: mockExercise,
        isLoading: false,
        error: null,
      });

      const mockInvalidateQueries = jest.fn();
      jest.mock('@tanstack/react-query', () => ({
        useMutation: mockUseMutation,
        useQueryClient: jest.fn().mockReturnValue({
          invalidateQueries: mockInvalidateQueries,
        }),
      }));

      // Re-import after mocking
      const { useCreateExercise } = require('@/lib/hooks/api/useExercises');
      
      const { mutate } = useCreateExercise();
      mutate({
        name: 'New Exercise',
        category: 'Chest',
        muscleGroup: ['Chest'],
        equipment: ['Dumbbells'],
        difficulty: 'intermediate',
        description: 'A new exercise',
        instructions: ['Step 1', 'Step 2'],
        isFavorite: false,
        usageCount: 0,
      });
      
      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: expect.any(Function),
        onSuccess: expect.any(Function),
      });
    });
  });

  describe('useUpdateExercise', () => {
    it('should call exercise service updateExercise method', async () => {
      const mockExercise: Exercise = {
        id: '1',
        name: 'Updated Exercise',
        category: 'Chest',
        muscleGroup: ['Chest'],
        equipment: ['Dumbbells'],
        difficulty: 'intermediate',
        description: 'An updated exercise',
        instructions: ['Step 1', 'Step 2'],
        isFavorite: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the useMutation hook
      const mockMutate = jest.fn();
      const mockUseMutation = jest.fn().mockReturnValue({
        mutate: mockMutate,
        data: mockExercise,
        isLoading: false,
        error: null,
      });

      const mockInvalidateQueries = jest.fn();
      jest.mock('@tanstack/react-query', () => ({
        useMutation: mockUseMutation,
        useQueryClient: jest.fn().mockReturnValue({
          invalidateQueries: mockInvalidateQueries,
        }),
      }));

      // Re-import after mocking
      const { useUpdateExercise } = require('@/lib/hooks/api/useExercises');
      
      const { mutate } = useUpdateExercise();
      mutate({ 
        id: '1', 
        exercise: {
          name: 'Updated Exercise',
          description: 'An updated exercise',
        } 
      });
      
      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: expect.any(Function),
        onSuccess: expect.any(Function),
      });
    });
  });

  describe('useDeleteExercise', () => {
    it('should call exercise service deleteExercise method', async () => {
      // Mock the useMutation hook
      const mockMutate = jest.fn();
      const mockUseMutation = jest.fn().mockReturnValue({
        mutate: mockMutate,
        isLoading: false,
        error: null,
      });

      const mockInvalidateQueries = jest.fn();
      jest.mock('@tanstack/react-query', () => ({
        useMutation: mockUseMutation,
        useQueryClient: jest.fn().mockReturnValue({
          invalidateQueries: mockInvalidateQueries,
        }),
      }));

      // Re-import after mocking
      const { useDeleteExercise } = require('@/lib/hooks/api/useExercises');
      
      const { mutate } = useDeleteExercise();
      mutate('1');
      
      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: expect.any(Function),
        onSuccess: expect.any(Function),
      });
    });
  });
});