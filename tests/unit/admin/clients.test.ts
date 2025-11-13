import { clientService } from '@/lib/api/services/client.service';
import { Client } from '@/types/domain/client.model';
import { useClients, useClient, useCreateClient, useUpdateClient } from '@/lib/hooks/api/useClients';

// Mock the apiClient
jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

// Mock the endpoints
jest.mock('@/lib/api/endpoints', () => ({
  endpoints: {
    client: '/clients',
  },
}));

// Mock the clientMapper
jest.mock('@/lib/mappers/client.mapper', () => ({
  clientMapper: {
    toModel: jest.fn((dto) => dto),
    toCreateDto: jest.fn((model) => model),
  },
}));

describe('Client Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all clients', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: '1', fullName: 'John Doe', phone: '+1234567890' },
            { id: '2', fullName: 'Jane Smith', phone: '+1234567891' },
          ],
        },
      };

      const { apiClient } = require('@/lib/api/client');
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await clientService.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/clients');
      expect(result).toEqual([
        { id: '1', fullName: 'John Doe', phone: '+1234567890' },
        { id: '2', fullName: 'Jane Smith', phone: '+1234567891' },
      ]);
    });

    it('should fetch clients with tenantId', async () => {
      const mockResponse = {
        data: {
          data: [{ id: '1', fullName: 'John Doe', phone: '+1234567890' }],
        },
      };

      const { apiClient } = require('@/lib/api/client');
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await clientService.getAll(1);

      expect(apiClient.get).toHaveBeenCalledWith('/clients?tenant_id=1');
      expect(result).toEqual([{ id: '1', fullName: 'John Doe', phone: '+1234567890' }]);
    });
  });

  describe('getById', () => {
    it('should fetch a client by ID', async () => {
      const mockResponse = {
        data: {
          data: { id: '1', fullName: 'John Doe', phone: '+1234567890' },
        },
      };

      const { apiClient } = require('@/lib/api/client');
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await clientService.getById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/clients/1');
      expect(result).toEqual({ id: '1', fullName: 'John Doe', phone: '+1234567890' });
    });
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const newClient: Partial<Client> = {
        fullName: 'New Client',
        phone: '+1234567892',
      };

      const mockResponse = {
        data: {
          data: { id: '3', fullName: 'New Client', phone: '+1234567892' },
        },
      };

      const { apiClient } = require('@/lib/api/client');
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await clientService.create(newClient);

      expect(apiClient.post).toHaveBeenCalledWith('/clients', newClient);
      expect(result).toEqual({ id: '3', fullName: 'New Client', phone: '+1234567892' });
    });
  });

  describe('update', () => {
    it('should update an existing client', async () => {
      const updatedClient: Partial<Client> = {
        fullName: 'Updated Client',
      };

      const mockResponse = {
        data: {
          data: { id: '1', fullName: 'Updated Client', phone: '+1234567890' },
        },
      };

      const { apiClient } = require('@/lib/api/client');
      (apiClient.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await clientService.update('1', updatedClient);

      expect(apiClient.put).toHaveBeenCalledWith('/clients/1', updatedClient);
      expect(result).toEqual({ id: '1', fullName: 'Updated Client', phone: '+1234567890' });
    });
  });
});

describe('useClients Hook', () => {
  it('should call client service getAll method', async () => {
    const mockClients: Client[] = [
      { id: '1', fullName: 'John Doe', phone: '+1234567890' } as Client,
      { id: '2', fullName: 'Jane Smith', phone: '+1234567891' } as Client,
    ];

    // Mock the useQuery hook
    const mockUseQuery = jest.fn().mockReturnValue({
      data: mockClients,
      isLoading: false,
      error: null,
    });

    jest.mock('@tanstack/react-query', () => ({
      useQuery: mockUseQuery,
    }));

    // Re-import after mocking
    const { useClients } = require('@/lib/hooks/api/useClients');
    
    const result = useClients();
    
    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['clients'],
      queryFn: expect.any(Function),
      staleTime: 120000,
    });
  });
});

describe('useClient Hook', () => {
  it('should call client service getById method', async () => {
    const mockClient = { id: '1', fullName: 'John Doe', phone: '+1234567890' } as Client;

    // Mock the useQuery hook
    const mockUseQuery = jest.fn().mockReturnValue({
      data: mockClient,
      isLoading: false,
      error: null,
    });

    jest.mock('@tanstack/react-query', () => ({
      useQuery: mockUseQuery,
    }));

    // Re-import after mocking
    const { useClient } = require('@/lib/hooks/api/useClients');
    
    const result = useClient('1');
    
    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['client', '1'],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });
});

describe('useCreateClient Hook', () => {
  it('should call client service create method', async () => {
    const mockClient = { id: '3', fullName: 'New Client', phone: '+1234567892' } as Client;

    // Mock the useMutation hook
    const mockMutate = jest.fn();
    const mockUseMutation = jest.fn().mockReturnValue({
      mutate: mockMutate,
      data: mockClient,
      isLoading: false,
      error: null,
    });

    jest.mock('@tanstack/react-query', () => ({
      useMutation: mockUseMutation,
      useQueryClient: jest.fn().mockReturnValue({
        invalidateQueries: jest.fn(),
      }),
    }));

    // Re-import after mocking
    const { useCreateClient } = require('@/lib/hooks/api/useClients');
    
    const { mutate } = useCreateClient();
    mutate({ fullName: 'New Client', phone: '+1234567892' });
    
    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
      onSuccess: expect.any(Function),
    });
  });
});

describe('useUpdateClient Hook', () => {
  it('should call client service update method', async () => {
    const mockClient = { id: '1', fullName: 'Updated Client', phone: '+1234567890' } as Client;

    // Mock the useMutation hook
    const mockMutate = jest.fn();
    const mockUseMutation = jest.fn().mockReturnValue({
      mutate: mockMutate,
      data: mockClient,
      isLoading: false,
      error: null,
    });

    jest.mock('@tanstack/react-query', () => ({
      useMutation: mockUseMutation,
      useQueryClient: jest.fn().mockReturnValue({
        invalidateQueries: jest.fn(),
      }),
    }));

    // Re-import after mocking
    const { useUpdateClient } = require('@/lib/hooks/api/useClients');
    
    const { mutate } = useUpdateClient();
    mutate({ id: '1', model: { fullName: 'Updated Client' } });
    
    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
      onSuccess: expect.any(Function),
    });
  });
});