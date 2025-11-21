import { POST } from '@/app/api/workouts/[id]/duplicate/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Mock the session
jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn().mockResolvedValue({
    user: { id: '1', role: 'trainer' },
  }),
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    training_plans: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('POST /api/workouts/[id]/duplicate', () => {
  const mockOriginalPlan = {
    id: BigInt(1),
    tenant_id: BigInt(1),
    customer_id: BigInt(1),
    version: 1,
    is_active: true,
    split: 'upper/lower',
    notes: 'Test plan',
    created_by: BigInt(1),
    created_at: new Date(),
    training_plan_exercises: [
      {
        id: BigInt(1),
        plan_id: BigInt(1),
        exercise_id: BigInt(1),
        sets: 3,
        reps: 10,
        order_index: 1,
        created_at: new Date(),
        exercise: {
          id: BigInt(1),
          name: { en: 'Bench Press' },
          tenant_id: BigInt(1),
          training_type_id: null,
          muscle_group_id: null,
          description: null,
          equipment_needed: null,
          calories_burned_per_min: null,
          created_at: new Date(),
        },
      },
    ],
    customer: {
      id: BigInt(1),
      first_name: 'John',
      last_name: 'Doe',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should duplicate a workout successfully', async () => {
    // Mock finding the original plan
    (prisma.training_plans.findUnique as jest.Mock).mockResolvedValue(mockOriginalPlan);

    // Mock finding the latest version
    (prisma.training_plans.findFirst as jest.Mock).mockResolvedValue({ version: 1 });

    // Mock creating the new plan
    const mockDuplicatedPlan = {
      ...mockOriginalPlan,
      id: BigInt(2),
      version: 2,
      is_active: false,
      notes: 'Test plan (Copy)',
    };
    (prisma.training_plans.create as jest.Mock).mockResolvedValue(mockDuplicatedPlan);

    const req = new NextRequest('http://localhost:3000/api/workouts/1/duplicate', {
      method: 'POST',
    });

    const response = await POST(req, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data.id).toBe('2');
    expect(data.data.version).toBe(2);
    expect(data.data.isActive).toBe(false);
    expect(prisma.training_plans.create).toHaveBeenCalled();
  });

  it('should return 404 if workout not found', async () => {
    (prisma.training_plans.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/api/workouts/999/duplicate', {
      method: 'POST',
    });

    const response = await POST(req, { params: { id: '999' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBeDefined();
  });

  it('should return 403 for unauthorized users', async () => {
    const { getSession } = require('@/lib/auth/session');
    getSession.mockResolvedValueOnce({
      user: { id: '1', role: 'client' },
    });

    const req = new NextRequest('http://localhost:3000/api/workouts/1/duplicate', {
      method: 'POST',
    });

    const response = await POST(req, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBeDefined();
  });
});
