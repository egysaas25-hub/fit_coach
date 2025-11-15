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

jest.mock('@/lib/auth/otp', () => ({
  otpStore: new Map(),
  generateOtp: jest.fn(() => '123456'),
  hashOtp: jest.fn((code) => code),
}));

// Mock the NextRequest
const createMockRequest = (body: any): NextRequest => {
  return {
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
};

describe('Request OTP API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate and store OTP for valid phone number', async () => {
    // Mock database responses
    (prisma.customers.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.team_members.findUnique as jest.Mock).mockResolvedValue(null);
    
    const mockRequest = createMockRequest({
      phone: '1234567890',
      countryCode: '+1',
    });

    const response: any = await POST(mockRequest);
    
    expect(response.success).equal(true);
  });

  it('should return error for missing phone number', async () => {
    const mockRequest = createMockRequest({
      countryCode: '+1',
    });

    const response: any = await POST(mockRequest);
    
    expect(response.success).equal(false);
    expect(response.statusCode).equal(400);
  });

  it('should return error for missing country code', async () => {
    const mockRequest = createMockRequest({
      phone: '1234567890',
    });

    const response: any = await POST(mockRequest);
    
    expect(response.success).equal(false);
    expect(response.statusCode).equal(400);
  });
});