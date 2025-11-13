import { prisma } from '@/lib/prisma';

describe('Customers API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/customers', () => {
    it('should fetch all customers successfully', async () => {
      // Mock the database response
      const mockCustomers = [
        {
          id: BigInt(1),
          tenant_id: BigInt(1),
          phone_e164: '+1234567890',
          first_name: 'John',
          last_name: 'Doe',
          source: 'sales',
          status: 'lead',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: BigInt(2),
          tenant_id: BigInt(1),
          phone_e164: '+1234567891',
          first_name: 'Jane',
          last_name: 'Smith',
          source: 'referral',
          status: 'active',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (prisma.customers.findMany as jest.Mock).mockResolvedValue(mockCustomers);

      // Import the API route handler
      const { GET } = require('./route');

      // Create a mock request
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer mocked-jwt-token'),
        },
      };

      // Call the API route handler
      const response = await GET(mockRequest as any);

      // Parse the response
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.data[0].firstName).toBe('John');
      expect(data.data[1].firstName).toBe('Jane');

      // Verify the database call
      expect(prisma.customers.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: BigInt(1),
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    });

    it('should handle database errors gracefully', async () => {
      // Mock the database to throw an error
      (prisma.customers.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Import the API route handler
      const { GET } = require('./route');

      // Create a mock request
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer mocked-jwt-token'),
        },
      };

      // Call the API route handler
      const response = await GET(mockRequest as any);

      // Parse the response
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error.message).toBe('Failed to fetch customers');
    });
  });
});