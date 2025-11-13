import { NutritionService } from '@/lib/api/services/nutrition.service';
import { useNutritionPlans, useNutritionPlan, useCreateNutritionPlan, useUpdateNutritionPlan, useDeleteNutritionPlan } from '@/lib/hooks/api/useNutrition';
import { NutritionPlan } from '@/types/domain/nutrition.model';

// Mock the apiClient
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockDelete = jest.fn();

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
  },
}));

// Mock the endpoints
jest.mock('@/lib/api/endpoints', () => ({
  endpoints: {
    nutrition: '/nutrition-plans',
  },
}));

describe('Nutrition Service', () => {
  let nutritionService: NutritionService;
  
  beforeEach(() => {
    nutritionService = new NutritionService();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all nutrition plans', async () => {
      const mockPlans: NutritionPlan[] = [
        { 
          id: 1, 
          tenantId: 1, 
          customerId: '1', 
          version: 1, 
          isActive: true, 
          notes: null, 
          createdBy: 1, 
          createdAt: new Date(), 
          macros: [], 
          totalCalories: 0 
        },
        { 
          id: 2, 
          tenantId: 1, 
          customerId: '2', 
          version: 1, 
          isActive: true, 
          notes: null, 
          createdBy: 1, 
          createdAt: new Date(), 
          macros: [], 
          totalCalories: 0 
        },
      ];

      const mockResponse = {
        data: {
          data: mockPlans,
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await nutritionService.getAll();

      expect(mockGet).toHaveBeenCalledWith('/nutrition-plans');
      expect(result).toEqual(mockPlans);
    });

    it('should fetch nutrition plans for a specific customer', async () => {
      const mockPlans: NutritionPlan[] = [
        { 
          id: 1, 
          tenantId: 1, 
          customerId: '1', 
          version: 1, 
          isActive: true, 
          notes: null, 
          createdBy: 1, 
          createdAt: new Date(), 
          macros: [], 
          totalCalories: 0 
        },
      ];

      const mockResponse = {
        data: {
          data: mockPlans,
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await nutritionService.getAll('1');

      expect(mockGet).toHaveBeenCalledWith('/nutrition-plans?customerId=1');
      expect(result).toEqual(mockPlans);
    });
  });

  describe('getById', () => {
    it('should fetch a nutrition plan by ID', async () => {
      const mockPlan: NutritionPlan = { 
        id: 1, 
        tenantId: 1, 
        customerId: '1', 
        version: 1, 
        isActive: true, 
        notes: null, 
        createdBy: 1, 
        createdAt: new Date(), 
        macros: [], 
        totalCalories: 0 
      };

      const mockResponse = {
        data: {
          data: mockPlan,
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await nutritionService.getById('1');

      expect(mockGet).toHaveBeenCalledWith('/nutrition-plans/1');
      expect(result).toEqual(mockPlan);
    });
  });

  describe('create', () => {
    it('should create a new nutrition plan', async () => {
      const newPlan = {
        customerId: '1',
      };

      const mockCreatedPlan: NutritionPlan = { 
        id: 3, 
        tenantId: 1, 
        customerId: '1', 
        version: 1, 
        isActive: true, 
        notes: null, 
        createdBy: 1, 
        createdAt: new Date(), 
        macros: [], 
        totalCalories: 0 
      };

      const mockResponse = {
        data: {
          data: mockCreatedPlan,
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await nutritionService.create(newPlan);

      expect(mockPost).toHaveBeenCalledWith('/nutrition-plans', newPlan);
      expect(result).toEqual(mockCreatedPlan);
    });
  });

  describe('update', () => {
    it('should update an existing nutrition plan', async () => {
      const updatedPlan: Partial<NutritionPlan> = {
        // Only include properties that exist in NutritionPlan
        isActive: false,
      };

      const mockUpdatedPlan: NutritionPlan = { 
        id: 1, 
        tenantId: 1, 
        customerId: '1', 
        version: 1, 
        isActive: false, 
        notes: null, 
        createdBy: 1, 
        createdAt: new Date(), 
        macros: [], 
        totalCalories: 0 
      };

      const mockResponse = {
        data: {
          data: mockUpdatedPlan,
        },
      };

      mockPut.mockResolvedValue(mockResponse);

      const result = await nutritionService.update('1', updatedPlan);

      expect(mockPut).toHaveBeenCalledWith('/nutrition-plans/1', updatedPlan);
      expect(result).toEqual(mockUpdatedPlan);
    });
  });

  describe('delete', () => {
    it('should delete a nutrition plan', async () => {
      mockDelete.mockResolvedValue({});

      await nutritionService.delete('1');

      expect(mockDelete).toHaveBeenCalledWith('/nutrition-plans/1');
    });
  });
});

describe('Nutrition Hooks', () => {
  describe('useNutritionPlans', () => {
    it('should call nutrition service getAll method', async () => {
      const mockPlans: NutritionPlan[] = [
        { 
          id: 1, 
          tenantId: 1, 
          customerId: '1', 
          version: 1, 
          isActive: true, 
          notes: null, 
          createdBy: 1, 
          createdAt: new Date(), 
          macros: [], 
          totalCalories: 0 
        },
      ];

      // Mock the useQuery hook
      const mockUseQuery = jest.fn().mockReturnValue({
        data: mockPlans,
        isLoading: false,
        error: null,
      });

      jest.mock('@tanstack/react-query', () => ({
        useQuery: mockUseQuery,
      }));

      // Re-import after mocking
      const { useNutritionPlans } = require('@/lib/hooks/api/useNutrition');
      
      const result = useNutritionPlans('1');
      
      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['nutrition-plans', '1'],
        queryFn: expect.any(Function),
        enabled: true,
      });
    });
  });

  describe('useNutritionPlan', () => {
    it('should call nutrition service getById method', async () => {
      const mockPlan: NutritionPlan = { 
        id: 1, 
        tenantId: 1, 
        customerId: '1', 
        version: 1, 
        isActive: true, 
        notes: null, 
        createdBy: 1, 
        createdAt: new Date(), 
        macros: [], 
        totalCalories: 0 
      };

      // Mock the useQuery hook
      const mockUseQuery = jest.fn().mockReturnValue({
        data: mockPlan,
        isLoading: false,
        error: null,
      });

      jest.mock('@tanstack/react-query', () => ({
        useQuery: mockUseQuery,
      }));

      // Re-import after mocking
      const { useNutritionPlan } = require('@/lib/hooks/api/useNutrition');
      
      const result = useNutritionPlan('1');
      
      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['nutrition-plan', '1'],
        queryFn: expect.any(Function),
        enabled: true,
      });
    });
  });

  describe('useCreateNutritionPlan', () => {
    it('should call nutrition service create method', async () => {
      const mockPlan: NutritionPlan = { 
        id: 3, 
        tenantId: 1, 
        customerId: '1', 
        version: 1, 
        isActive: true, 
        notes: null, 
        createdBy: 1, 
        createdAt: new Date(), 
        macros: [], 
        totalCalories: 0 
      };

      // Mock the useMutation hook
      const mockMutate = jest.fn();
      const mockUseMutation = jest.fn().mockReturnValue({
        mutate: mockMutate,
        data: mockPlan,
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
      const { useCreateNutritionPlan } = require('@/lib/hooks/api/useNutrition');
      
      const { mutate } = useCreateNutritionPlan();
      mutate({ name: 'New Plan', customerId: '1' });
      
      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: expect.any(Function),
        onSuccess: expect.any(Function),
      });
    });
  });

  describe('useUpdateNutritionPlan', () => {
    it('should call nutrition service update method', async () => {
      const mockPlan: NutritionPlan = { 
        id: 1, 
        tenantId: 1, 
        customerId: '1', 
        version: 1, 
        isActive: false, 
        notes: null, 
        createdBy: 1, 
        createdAt: new Date(), 
        macros: [], 
        totalCalories: 0 
      };

      // Mock the useMutation hook
      const mockMutate = jest.fn();
      const mockUseMutation = jest.fn().mockReturnValue({
        mutate: mockMutate,
        data: mockPlan,
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
      const { useUpdateNutritionPlan } = require('@/lib/hooks/api/useNutrition');
      
      const { mutate } = useUpdateNutritionPlan();
      mutate({ id: '1', data: { name: 'Updated Plan' } });
      
      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: expect.any(Function),
        onSuccess: expect.any(Function),
      });
    });
  });

  describe('useDeleteNutritionPlan', () => {
    it('should call nutrition service delete method', async () => {
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
      const { useDeleteNutritionPlan } = require('@/lib/hooks/api/useNutrition');
      
      const { mutate } = useDeleteNutritionPlan();
      mutate('1');
      
      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: expect.any(Function),
        onSuccess: expect.any(Function),
      });
    });
  });
});