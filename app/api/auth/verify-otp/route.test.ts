import { POST } from './route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock the modules
jest.mock('@/lib/utils/response', () => ({
  success: jest.fn((data) => ({ success: true, data })),
  error: jest.fn((message, code) => ({ success: false, statusCode: code, error: { message } })),
}));

jest.mock('@/lib/middleware/rate-limit.middleware', () => ({
  withRateLimit: jest.fn((handler) => handler),
}));

jest.mock('@/lib/middleware/logging.middleware', () => ({
  withLogging: jest.fn((handler) => handler),
  logAuthAttempt: jest.fn(),
}));

jest.mock('@/lib/auth/jwt', () => ({
  generateToken: jest.fn(() => 'mocked-jwt-token'),
}));

jest.mock('@/lib/auth/otp', () => ({
  otpStore: new Map(),
  hashOtp: jest.fn((code) => code),
}));

// Mock the NextRequest
const createMockRequest = (body: any): NextRequest => {
  return {
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
};

describe('Verify OTP API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Initialize the OTP store with a test entry
    const { otpStore } = require('@/lib/auth/otp');
    otpStore.set('+1:1234567890', { 
      hash: '123456', 
      expiresAt: Date.now() + 120 * 1000, 
      attempts: 0 
    });
  });

  afterEach(() => {
    // Clear the OTP store after each test
    const { otpStore } = require('@/lib/auth/otp');
    otpStore.clear();
  });

  it('should verify OTP and login existing customer', async () => {
    // Mock database responses
    (prisma.customers.findUnique as jest.Mock).mockResolvedValue({
      id: BigInt(1),
      first_name: 'Test',
      last_name: 'Customer',
      phone_e164: '+11234567890',
    });
    (prisma.team_members.findUnique as jest.Mock).mockResolvedValue(null);
    
    const mockRequest = createMockRequest({
      phone: '1234567890',
      countryCode: '+1',
      code: '123456',
    });

    const response: any = await POST(mockRequest);
    
    expect(response.success).equal(true);
    expect(response.data.user.type).equal('customer');
  });

  it('should verify OTP and login existing team member', async () => {
    // Mock database responses
    (prisma.customers.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.team_members.findUnique as jest.Mock).mockResolvedValue({
      id: BigInt(1),
      full_name: 'Test Admin',
      email: 'admin@test.com',
      role: 'admin',
    });
    
    const mockRequest = createMockRequest({
      phone: '1234567890',
      countryCode: '+1',
      code: '123456',
    });

    const response: any = await POST(mockRequest);
    
    expect(response.success).equal(true);
    expect(response.data.user.type).equal('team_member');
  });

  it('should return error for invalid OTP code', async () => {
    const mockRequest = createMockRequest({
      phone: '1234567890',
      countryCode: '+1',
      code: '000000',
    });

    const response: any = await POST(mockRequest);
    
    expect(response.success).equal(false);
    expect(response.statusCode).equal(401);
  });

  it('should return error for missing required fields', async () => {
    const mockRequest = createMockRequest({
      countryCode: '+1',
      code: '123456',
    });

    const response: any = await POST(mockRequest);
    
    expect(response.success).equal(false);
    expect(response.statusCode).equal(400);
  });
});