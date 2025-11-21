import { POST } from '@/app/api/nutrition/[id]/duplicate/route';
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
    nutrition_plans: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    nutrition_plan_macros: {
      createMany: jest.fn(),
    },
    nutrition_meals: {
      create: jest.fn(),
    },
    nutrition_meal_items: {
      createMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('POST /api/nutrition/[id]/duplicate', () => {
  const mockOriginalPlan = {
    id: BigInt(1),
    tenant_id: BigInt(1),
    customer_id: BigInt(1),
    version: 1,
    is_active: true,
    calories_target: 2000,
    notes: 'Test nutrition plan',
    created_by: BigInt(1),
    created_at: new Date(),
    nutrition_plan_macros: [
      {
        id: BigInt(1),
        plan_id: BigInt(1),
        calories: 2000,
        protein_g: 150,
        carbs_g: 200,
        fat_g: 70,
        created_at: new Date(),
      },
    ],
    nutrition_meals: [
      {
        id: BigInt(1),
        tenant_id: BigInt(1),
        plan_id: BigInt(1),
        meal_name: 'Breakfast',
        order_index: 1,
        notes: null,
        nutrition_meal_items: [
          {
            id: BigInt(1),
            tenant_id: BigInt(1),
            meal_id: BigInt(1),
            food_name: 'Oatmeal',
            food_id: null,
            portion_size: '1 cup',
            calories: 300,
            protein_g: 10,
            carbs_g: 50,
            fat_g: 5,
            fiber_g: 8,
            alternatives: null,
            order_index: 1,
          },
        ],
      },
    ],
    customer: {
      id: BigInt(1),
      first_name: 'Jane',
      last_name: 'Smith',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should duplicate a nutrition plan successfully', async () => {
    // Mock finding the original plan
    (prisma.nutrition_plans.findUnique as jest.Mock).mockResolvedValue(mockOriginalPlan);

    // Mock finding the latest version
    (prisma.nutrition_plans.findFirst as jest.Mock).mockResolvedValue({ version: 1 });

    // Mock the transaction
    const mockDuplicatedPlan = {
      id: BigInt(2),
      tenant_id: BigInt(1),
      customer_id: BigInt(1),
      version: 2,
      is_active: false,
      calories_target: 2000,
      notes: 'Test nutrition plan (Copy)',
      created_by: BigInt(1),
      created_at: new Date(),
      nutrition_plan_macros: [
        {
          id: BigInt(2),
          plan_id: BigInt(2),
          calories: 2000,
          protein_g: 150,
          carbs_g: 200,
          fat_g: 70,
          created_at: new Date(),
        },
      ],
      nutrition_meals: [
        {
          id: BigInt(2),
          tenant_id: BigInt(1),
          plan_id: BigInt(2),
          meal_name: 'Breakfast',
          order_index: 1,
          notes: null,
          nutrition_meal_items: [
            {
              id: BigInt(2),
              tenant_id: BigInt(1),
              meal_id: BigInt(2),
              food_name: 'Oatmeal',
              food_id: null,
              portion_size: '1 cup',
              calories: 300,
              protein_g: 10,
              carbs_g: 50,
              fat_g: 5,
              fiber_g: 8,
              alternatives: null,
              order_index: 1,
            },
          ],
        },
      ],
      customer: {
        id: BigInt(1),
        first_name: 'Jane',
        last_name: 'Smith',
      },
    };

    (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
      return callback({
        nutrition_plans: {
          create: jest.fn().mockResolvedValue({ id: BigInt(2) }),
          findUnique: jest.fn().mockResolvedValue(mockDuplicatedPlan),
        },
        nutrition_plan_macros: {
          createMany: jest.fn(),
        },
        nutrition_meals: {
          create: jest.fn().mockResolvedValue({ id: BigInt(2) }),
        },
        nutrition_meal_items: {
          createMany: jest.fn(),
        },
      });
    });

    const req = new NextRequest('http://localhost:3000/api/nutrition/1/duplicate', {
      method: 'POST',
    });

    const response = await POST(req, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data.id).toBe('2');
    expect(data.data.version).toBe(2);
    expect(data.data.isActive).toBe(false);
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it('should return 404 if nutrition plan not found', async () => {
    (prisma.nutrition_plans.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/api/nutrition/999/duplicate', {
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

    const req = new NextRequest('http://localhost:3000/api/nutrition/1/duplicate', {
      method: 'POST',
    });

    const response = await POST(req, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBeDefined();
  });
});
