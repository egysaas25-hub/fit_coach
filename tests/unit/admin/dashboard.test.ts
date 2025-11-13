import { DashboardService } from '@/lib/api/services/dashboard.service';
import { useDashboardStats } from '@/lib/hooks/api/useDashboard';
import { DashboardStats } from '@/types/domain/dashboard';

// Mock the apiClient
jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

// Mock the endpoints
jest.mock('@/lib/api/endpoints', () => ({
  endpoints: {
    admin: {
      analytics: {
        dashboard: '/admin/analytics/dashboard',
        clients: '/admin/analytics/clients',
      },
    },
  },
}));

describe('Dashboard Service', () => {
  let dashboardService: DashboardService;
  
  beforeEach(() => {
    dashboardService = new DashboardService();
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should fetch and transform dashboard statistics', async () => {
      const mockResponse = {
        data: {
          data: {
            overview: {
              totalClients: 100,
              totalTrainers: 10,
            },
            growth: {
              clientGrowthRate: 15,
            },
            activity: {
              workoutsThisWeek: 250,
            },
          },
        },
      };

      const { apiClient } = require('@/lib/api/client');
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await dashboardService.getDashboardStats();

      expect(apiClient.get).toHaveBeenCalledWith('/admin/analytics/dashboard');
      expect(result).toEqual({
        totalUsers: 110,
        revenue: 0,
        growthRate: 15,
        activeSessions: 250,
        openTickets: 0,
        avgResponseTime: '0h',
      });
    });

    it('should handle API errors', async () => {
      const { apiClient } = require('@/lib/api/client');
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(dashboardService.getDashboardStats()).rejects.toThrow('API Error');
    });
  });

  describe('getClientAnalytics', () => {
    it('should fetch client analytics data', async () => {
      const mockResponse = {
        data: {
          data: {
            clientData: 'test',
          },
        },
      };

      const { apiClient } = require('@/lib/api/client');
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await dashboardService.getClientAnalytics();

      expect(apiClient.get).toHaveBeenCalledWith('/admin/analytics/clients');
      expect(result).toEqual({ clientData: 'test' });
    });
  });
});

describe('useDashboardStats Hook', () => {
  it('should call dashboard service getDashboardStats method', async () => {
    const mockStats: DashboardStats = {
      totalUsers: 100,
      revenue: 5000,
      growthRate: 10,
      activeSessions: 50,
      openTickets: 5,
      avgResponseTime: '2h',
    };

    // Mock the DashboardService
    const mockDashboardService = {
      getDashboardStats: jest.fn().mockResolvedValue(mockStats),
    };

    // Mock the useQuery hook
    const mockUseQuery = jest.fn().mockReturnValue({
      data: mockStats,
      isLoading: false,
      error: null,
    });

    jest.mock('@tanstack/react-query', () => ({
      useQuery: mockUseQuery,
    }));

    jest.mock('@/lib/api/services/dashboard.service', () => {
      return {
        DashboardService: jest.fn().mockImplementation(() => mockDashboardService),
      };
    });

    // Re-import after mocking
    const { useDashboardStats } = require('@/lib/hooks/api/useDashboard');
    
    const result = useDashboardStats();
    
    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['dashboard', 'stats'],
      queryFn: expect.any(Function),
      staleTime: 120000,
    });
  });
});