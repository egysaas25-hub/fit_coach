import { registerHandler } from './register/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock the NextRequest
const createMockRequest = (body: any): NextRequest => {
  return {
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
};

describe('Register API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('registerHandler', () => {
    it('should create a new customer successfully', async () => {
      // Mock the database responses
      (prisma.customers.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.customers.create as jest.Mock).mockResolvedValue({
        id: BigInt(1),
        first_name: 'John',
        last_name: 'Doe',
        phone_e164: '+1234567890',
      });

      const mockRequest = createMockRequest({
        email: 'john@example.com',
        password: 'Password123!',
        name: 'John Doe',
        phone: '+1234567890',
        role: 'client',
      });

      const response = await registerHandler(mockRequest, {
        email: 'john@example.com',
        password: 'Password123!',
        name: 'John Doe',
        phone: '+1234567890',
        role: 'client',
      });

      expect(response).toEqual({
        success: true,
        data: {
          user: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567890',
            role: 'client',
            type: 'customer',
          },
          token: 'mocked-jwt-token',
        },
        statusCode: 201,
      });

      // Verify the database calls
      expect(prisma.customers.findUnique).toHaveBeenCalledWith({
        where: {
          uq_customer_phone: {
            tenant_id: BigInt(1),
            phone_e164: '+1234567890',
          },
        },
      });

      expect(prisma.customers.create).toHaveBeenCalledWith({
        data: {
          tenant_id: BigInt(1),
          phone_e164: '+1234567890',
          first_name: 'John',
          last_name: 'Doe',
          source: 'sales',
          status: 'lead',
        },
      });
    });

    it('should create a new team member successfully', async () => {
      // Mock the database responses
      (prisma.team_members.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.team_members.create as jest.Mock).mockResolvedValue({
        id: BigInt(1),
        full_name: 'Jane Admin',
        email: 'jane@example.com',
        role: 'admin',
      });

      const mockRequest = createMockRequest({
        email: 'jane@example.com',
        password: 'Password123!',
        name: 'Jane Admin',
        role: 'admin',
      });

      const response = await registerHandler(mockRequest, {
        email: 'jane@example.com',
        password: 'Password123!',
        name: 'Jane Admin',
        role: 'admin',
      });

      expect(response).toEqual({
        success: true,
        data: {
          user: {
            id: '1',
            fullName: 'Jane Admin',
            email: 'jane@example.com',
            role: 'admin',
            type: 'team_member',
          },
          token: 'mocked-jwt-token',
        },
        statusCode: 201,
      });

      // Verify the database calls
      expect(prisma.team_members.findUnique).toHaveBeenCalledWith({
        where: {
          uq_team_email: {
            tenant_id: BigInt(1),
            email: 'jane@example.com',
          },
        },
      });

      expect(prisma.team_members.create).toHaveBeenCalledWith({
        data: {
          tenant_id: BigInt(1),
          full_name: 'Jane Admin',
          email: 'jane@example.com',
          role: 'admin',
        },
      });
    });

    it('should return 409 if customer already exists', async () => {
      // Mock the database responses
      (prisma.customers.findUnique as jest.Mock).mockResolvedValue({
        id: BigInt(1),
        first_name: 'John',
        last_name: 'Doe',
        phone_e164: '+1234567890',
      });

      const mockRequest = createMockRequest({
        email: 'john@example.com',
        password: 'Password123!',
        name: 'John Doe',
        phone: '+1234567890',
        role: 'client',
      });

      const response = await registerHandler(mockRequest, {
        email: 'john@example.com',
        password: 'Password123!',
        name: 'John Doe',
        phone: '+1234567890',
        role: 'client',
      });

      expect(response).toEqual({
        success: false,
        error: {
          message: 'Client with this phone number already exists',
        },
        statusCode: 409,
      });
    });

    it('should return 409 if team member already exists', async () => {
      // Mock the database responses
      (prisma.team_members.findUnique as jest.Mock).mockResolvedValue({
        id: BigInt(1),
        full_name: 'Jane Admin',
        email: 'jane@example.com',
        role: 'admin',
      });

      const mockRequest = createMockRequest({
        email: 'jane@example.com',
        password: 'Password123!',
        name: 'Jane Admin',
        role: 'admin',
      });

      const response = await registerHandler(mockRequest, {
        email: 'jane@example.com',
        password: 'Password123!',
        name: 'Jane Admin',
        role: 'admin',
      });

      expect(response).toEqual({
        success: false,
        error: {
          message: 'Team member with this email already exists',
        },
        statusCode: 409,
      });
    });
  });
});