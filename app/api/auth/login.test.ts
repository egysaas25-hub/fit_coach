import { loginHandler } from './login/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock the NextRequest
const createMockRequest = (body: any): NextRequest => {
  return {
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
};

describe('Login API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('loginHandler', () => {
    it('should login a team member successfully with bypass validation', async () => {
      // Mock the database response
      (prisma.team_members.findUnique as jest.Mock).mockResolvedValue({
        id: BigInt(1),
        full_name: 'Test Admin',
        email: 'admin@example.com',
        role: 'admin',
      });

      const mockRequest = createMockRequest({
        email: 'admin@example.com',
        password: 'Password123!',
        bypassValidation: true,
      });

      const response: any = await loginHandler(mockRequest);

      expect(response.success).toBe(true);
      expect(response.data.user.email).toBe('admin@example.com');
      expect(response.data.user.role).toBe('admin');
      expect(response.data.token).toBe('mocked-jwt-token');

      // Verify the database call
      expect(prisma.team_members.findUnique).toHaveBeenCalledWith({
        where: {
          uq_team_email: {
            tenant_id: BigInt(1),
            email: 'admin@example.com',
          },
        },
      });
    });

    it('should login a customer successfully with bypass validation', async () => {
      // Mock the database responses
      (prisma.team_members.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.customers.findUnique as jest.Mock).mockResolvedValue({
        id: BigInt(1),
        first_name: 'Test',
        last_name: 'Client',
        phone_e164: '+1234567890',
      });

      const mockRequest = createMockRequest({
        email: 'client@example.com',
        password: 'Password123!',
        bypassValidation: true,
      });

      const response: any = await loginHandler(mockRequest);

      expect(response.success).toBe(true);
      expect(response.data.user.firstName).toBe('Test');
      expect(response.data.user.lastName).toBe('Client');
      expect(response.data.user.phone).toBe('+1234567890');
      expect(response.data.user.role).toBe('client');
      expect(response.data.token).toBe('mocked-jwt-token');

      // Verify the database calls
      expect(prisma.team_members.findUnique).toHaveBeenCalledWith({
        where: {
          uq_team_email: {
            tenant_id: BigInt(1),
            email: 'client@example.com',
          },
        },
      });

      expect(prisma.customers.findUnique).toHaveBeenCalledWith({
        where: {
          uq_customer_phone: {
            tenant_id: BigInt(1),
            phone_e164: 'client@example.com',
          },
        },
      });
    });

    it('should return 401 for invalid credentials with bypass validation', async () => {
      // Mock the database responses
      (prisma.team_members.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.customers.findUnique as jest.Mock).mockResolvedValue(null);

      const mockRequest = createMockRequest({
        email: 'nonexistent@example.com',
        password: 'Password123!',
        bypassValidation: true,
      });

      const response: any = await loginHandler(mockRequest);

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(401);
      expect(response.error.message).toBe('Invalid credentials.');
    });

    it('should return 401 when email and password are missing', async () => {
      const mockRequest = createMockRequest({});

      const response: any = await loginHandler(mockRequest);

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(401);
      expect(response.error.message).toBe('Email and password are required.');
    });
  });
});