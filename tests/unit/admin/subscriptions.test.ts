import { SubscriptionService } from '@/lib/api/services/subscription.service';
import { 
  useSubscriptions, 
  useCreateSubscription,
  useInvoices,
  usePayments
} from '@/lib/hooks/api/useSubscriptions';
import { Subscription, Invoice, Payment, PaymentStatus } from '@/types/domain/subscription';

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
    admin: {
      analytics: {
        dashboard: '/admin/analytics/dashboard',
      },
    },
  },
}));

describe('Subscription Service', () => {
  let subscriptionService: SubscriptionService;
  
  beforeEach(() => {
    subscriptionService = new SubscriptionService();
    jest.clearAllMocks();
  });

  describe('getSubscriptions', () => {
    it('should fetch all subscriptions', async () => {
      const mockSubscriptions: Subscription[] = [
        { 
          id: '1', 
          clientId: '1', 
          planId: '1', 
          amount: 29.99, 
          status: PaymentStatus.Active, 
          nextBilling: '2023-12-01', 
          startDate: '2023-11-01',
          createdAt: '2023-11-01T00:00:00Z',
          updatedAt: '2023-11-01T00:00:00Z'
        },
        { 
          id: '2', 
          clientId: '2', 
          planId: '2', 
          amount: 49.99, 
          status: PaymentStatus.Cancelled, 
          nextBilling: '2023-11-15', 
          startDate: '2023-10-15',
          createdAt: '2023-10-15T00:00:00Z',
          updatedAt: '2023-10-15T00:00:00Z'
        },
      ];

      const mockResponse = {
        data: {
          data: mockSubscriptions,
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await subscriptionService.getSubscriptions();

      expect(mockGet).toHaveBeenCalledWith('/admin/analytics/dashboard');
      expect(result).toEqual(mockSubscriptions);
    });

    it('should handle API errors when fetching subscriptions', async () => {
      mockGet.mockRejectedValue(new Error('API Error'));

      await expect(subscriptionService.getSubscriptions()).rejects.toThrow('Failed to fetch subscriptions');
    });
  });

  describe('createSubscription', () => {
    it('should create a new subscription', async () => {
      const newSubscription = {
        clientId: '3',
        planId: '1',
        amount: 29.99,
        status: PaymentStatus.Active,
      };

      const mockCreatedSubscription: Subscription = {
        id: '3',
        clientId: '3',
        planId: '1',
        amount: 29.99,
        status: PaymentStatus.Active,
        nextBilling: '2023-12-01',
        startDate: '2023-11-01',
        createdAt: '2023-11-01T00:00:00Z',
        updatedAt: '2023-11-01T00:00:00Z'
      };

      const mockResponse = {
        data: {
          data: mockCreatedSubscription,
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await subscriptionService.createSubscription(newSubscription);

      expect(mockPost).toHaveBeenCalledWith('/admin/analytics/dashboard', newSubscription);
      expect(result).toEqual(mockCreatedSubscription);
    });

    it('should handle API errors when creating a subscription', async () => {
      mockPost.mockRejectedValue(new Error('API Error'));

      await expect(subscriptionService.createSubscription({})).rejects.toThrow('Failed to create subscription');
    });
  });

  describe('getInvoices', () => {
    it('should fetch invoices for a subscription', async () => {
      const mockInvoices: Invoice[] = [
        { 
          id: '1', 
          subscriptionId: '1', 
          amount: 29.99, 
          status: PaymentStatus.Active, 
          issuedAt: '2023-11-01', 
          dueAt: '2023-11-01' 
        },
        { 
          id: '2', 
          subscriptionId: '1', 
          amount: 29.99, 
          status: PaymentStatus.PastDue, 
          issuedAt: '2023-11-01', 
          dueAt: '2023-12-01' 
        },
      ];

      const mockResponse = {
        data: {
          data: mockInvoices,
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await subscriptionService.getInvoices('1');

      expect(mockGet).toHaveBeenCalledWith('/admin/analytics/dashboard/1/invoices');
      expect(result).toEqual(mockInvoices);
    });

    it('should handle API errors when fetching invoices', async () => {
      mockGet.mockRejectedValue(new Error('API Error'));

      await expect(subscriptionService.getInvoices('1')).rejects.toThrow('Failed to fetch invoices');
    });
  });

  describe('getPayments', () => {
    it('should fetch payments for a subscription', async () => {
      const mockPayments: Payment[] = [
        { 
          id: '1', 
          subscriptionId: '1', 
          amount: 29.99, 
          status: PaymentStatus.Active, 
          processedAt: '2023-11-01',
          method: 'credit_card'
        },
      ];

      const mockResponse = {
        data: {
          data: mockPayments,
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await subscriptionService.getPayments('1');

      expect(mockGet).toHaveBeenCalledWith('/admin/analytics/dashboard/1/payments');
      expect(result).toEqual(mockPayments);
    });

    it('should handle API errors when fetching payments', async () => {
      mockGet.mockRejectedValue(new Error('API Error'));

      await expect(subscriptionService.getPayments('1')).rejects.toThrow('Failed to fetch payments');
    });
  });
});

describe('Subscription Hooks', () => {
  describe('useSubscriptions', () => {
    it('should fetch subscriptions', () => {
      const mockSubscriptions: Subscription[] = [
        { id: '1', clientId: '1', planId: '1', amount: 29.99, status: 'Active', nextBilling: '2023-12-01', startDate: '2023-11-01' } as Subscription,
      ];

      const mockUseState = jest.fn()
        .mockReturnValueOnce([mockSubscriptions, jest.fn()]) // subscriptions
        .mockReturnValueOnce([false, jest.fn()]) // loading
        .mockReturnValueOnce([null, jest.fn()]); // error

      const mockUseEffect = jest.fn().mockImplementation((fn) => fn());
      const mockUseCallback = jest.fn().mockImplementation((fn) => fn);

      jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: mockUseState,
        useEffect: mockUseEffect,
        useCallback: mockUseCallback,
      }));

      // Mock the SubscriptionService
      const mockSubscriptionService = {
        getSubscriptions: jest.fn().mockResolvedValue(mockSubscriptions),
      };

      jest.mock('@/lib/api/services/subscription.service', () => {
        return {
          SubscriptionService: jest.fn().mockImplementation(() => mockSubscriptionService),
        };
      });

      // Re-import after mocking
      const { useSubscriptions } = require('@/lib/hooks/api/useSubscriptions');
      
      const { subscriptions, loading, error } = useSubscriptions();
      
      expect(subscriptions).toEqual(mockSubscriptions);
      expect(loading).toBe(false);
      expect(error).toBeNull();
    });
  });

  describe('useCreateSubscription', () => {
    it('should create a subscription', async () => {
      const mockSubscription: Subscription = {
        id: '3',
        clientId: '3',
        planId: '1',
        amount: 29.99,
        status: 'Active',
        nextBilling: '2023-12-01',
        startDate: '2023-11-01',
      } as Subscription;

      const mockUseState = jest.fn()
        .mockReturnValueOnce([false, jest.fn()]) // loading
        .mockReturnValueOnce([null, jest.fn()]); // error

      jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: mockUseState,
        useCallback: (fn: any) => fn,
      }));

      // Mock the SubscriptionService
      const mockSubscriptionService = {
        createSubscription: jest.fn().mockResolvedValue(mockSubscription),
      };

      jest.mock('@/lib/api/services/subscription.service', () => {
        return {
          SubscriptionService: jest.fn().mockImplementation(() => mockSubscriptionService),
        };
      });

      // Re-import after mocking
      const { useCreateSubscription } = require('@/lib/hooks/api/useSubscriptions');
      
      const { createSubscription } = useCreateSubscription();
      const result = await createSubscription({ clientId: '3', planId: '1', amount: 29.99, status: 'Active' });
      
      expect(mockSubscriptionService.createSubscription).toHaveBeenCalledWith({
        clientId: '3',
        planId: '1',
        amount: 29.99,
        status: 'Active',
      });
      expect(result).toEqual(mockSubscription);
    });
  });

  describe('useInvoices', () => {
    it('should fetch invoices for a subscription', () => {
      const mockInvoices: Invoice[] = [
        { 
          id: '1', 
          subscriptionId: '1', 
          amount: 29.99, 
          status: PaymentStatus.Active, 
          issuedAt: '2023-11-01', 
          dueAt: '2023-11-01' 
        },
      ];

      const mockUseState = jest.fn()
        .mockReturnValueOnce([mockInvoices, jest.fn()]) // invoices
        .mockReturnValueOnce([false, jest.fn()]) // loading
        .mockReturnValueOnce([null, jest.fn()]); // error

      const mockUseEffect = jest.fn().mockImplementation((fn) => fn());
      const mockUseCallback = jest.fn().mockImplementation((fn) => fn);

      jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: mockUseState,
        useEffect: mockUseEffect,
        useCallback: mockUseCallback,
      }));

      // Mock the SubscriptionService
      const mockSubscriptionService = {
        getInvoices: jest.fn().mockResolvedValue(mockInvoices),
      };

      jest.mock('@/lib/api/services/subscription.service', () => {
        return {
          SubscriptionService: jest.fn().mockImplementation(() => mockSubscriptionService),
        };
      });

      // Re-import after mocking
      const { useInvoices } = require('@/lib/hooks/api/useSubscriptions');
      
      const { invoices, loading, error } = useInvoices('1');
      
      expect(mockSubscriptionService.getInvoices).toHaveBeenCalledWith('1');
      expect(invoices).toEqual(mockInvoices);
      expect(loading).toBe(false);
      expect(error).toBeNull();
    });
  });

  describe('usePayments', () => {
    it('should fetch payments for a subscription', () => {
      const mockPayments: Payment[] = [
        { 
          id: '1', 
          subscriptionId: '1', 
          amount: 29.99, 
          status: PaymentStatus.Active, 
          processedAt: '2023-11-01',
          method: 'credit_card'
        },
      ];

      const mockUseState = jest.fn()
        .mockReturnValueOnce([mockPayments, jest.fn()]) // payments
        .mockReturnValueOnce([false, jest.fn()]) // loading
        .mockReturnValueOnce([null, jest.fn()]); // error

      const mockUseEffect = jest.fn().mockImplementation((fn) => fn());
      const mockUseCallback = jest.fn().mockImplementation((fn) => fn);

      jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: mockUseState,
        useEffect: mockUseEffect,
        useCallback: mockUseCallback,
      }));

      // Mock the SubscriptionService
      const mockSubscriptionService = {
        getPayments: jest.fn().mockResolvedValue(mockPayments),
      };

      jest.mock('@/lib/api/services/subscription.service', () => {
        return {
          SubscriptionService: jest.fn().mockImplementation(() => mockSubscriptionService),
        };
      });

      // Re-import after mocking
      const { usePayments } = require('@/lib/hooks/api/useSubscriptions');
      
      const { payments, loading, error } = usePayments('1');
      
      expect(mockSubscriptionService.getPayments).toHaveBeenCalledWith('1');
      expect(payments).toEqual(mockPayments);
      expect(loading).toBe(false);
      expect(error).toBeNull();
    });
  });
});