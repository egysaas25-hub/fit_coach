import { POST as ProgressReportPOST } from '@/app/api/export/progress-report/route';
import { POST as InvoicePOST } from '@/app/api/export/invoice/route';
import { POST as PlanPOST } from '@/app/api/export/plan/route';
import { NextRequest } from 'next/server';
import * as pdfGenerator from '@/lib/services/pdf-generator';

// Mock the session
jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn().mockResolvedValue({
    user: { id: 1, tenant_id: 1, role: 'trainer', full_name: 'Test Trainer' },
  }),
}));

// Mock Prisma
jest.mock('@/lib/db/local', () => ({
  prisma: {
    customers: {
      findUnique: jest.fn(),
    },
    progress_tracking: {
      findMany: jest.fn(),
    },
    inbody_metrics: {
      findMany: jest.fn(),
    },
    payments: {
      findUnique: jest.fn(),
    },
    training_plans: {
      findUnique: jest.fn(),
    },
    nutrition_plans: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock PDF generator service
jest.mock('@/lib/services/pdf-generator', () => ({
  pdfGenerator: {
    generateProgressReportPDF: jest.fn(),
    generateInvoicePDF: jest.fn(),
    generateWorkoutPlanPDF: jest.fn(),
    generateNutritionPlanPDF: jest.fn(),
  },
}));

const { prisma } = require('@/lib/db/local');

describe('Export API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/export/progress-report', () => {
    it('should generate progress report PDF successfully', async () => {
      const mockClient = {
        id: BigInt(1),
        first_name: 'John',
        last_name: 'Doe',
        phone_e164: '+1234567890',
      };

      const mockProgressData = [
        {
          recorded_at: new Date('2025-01-01'),
          weight_kg: 75.5,
          notes: 'Great progress',
        },
      ];

      const mockInbodyData = [
        {
          recorded_at: new Date('2025-01-01'),
          weight_kg: 75.5,
          body_fat_percent: 15.2,
          muscle_mass_kg: 60.0,
          bmi: 22.5,
        },
      ];

      prisma.customers.findUnique.mockResolvedValue(mockClient);
      prisma.progress_tracking.findMany.mockResolvedValue(mockProgressData);
      prisma.inbody_metrics.findMany.mockResolvedValue(mockInbodyData);
      (pdfGenerator.pdfGenerator.generateProgressReportPDF as jest.Mock).mockResolvedValue(
        'https://blob.vercel-storage.com/progress-report.pdf'
      );

      const req = new NextRequest('http://localhost:3000/api/export/progress-report', {
        method: 'POST',
        body: JSON.stringify({
          clientId: '1',
          dateRange: {
            startDate: '2025-01-01',
            endDate: '2025-01-31',
          },
        }),
      });

      const response = await ProgressReportPOST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.pdfUrl).toBeDefined();
      expect(pdfGenerator.pdfGenerator.generateProgressReportPDF).toHaveBeenCalled();
    });

    it('should return 400 if clientId is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/export/progress-report', {
        method: 'POST',
        body: JSON.stringify({
          dateRange: {
            startDate: '2025-01-01',
            endDate: '2025-01-31',
          },
        }),
      });

      const response = await ProgressReportPOST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should return 404 if client not found', async () => {
      prisma.customers.findUnique.mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/export/progress-report', {
        method: 'POST',
        body: JSON.stringify({
          clientId: '999',
          dateRange: {
            startDate: '2025-01-01',
            endDate: '2025-01-31',
          },
        }),
      });

      const response = await ProgressReportPOST(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Client not found');
    });
  });

  describe('POST /api/export/invoice', () => {
    it('should generate invoice PDF successfully', async () => {
      const mockPayment = {
        id: BigInt(1),
        amount_cents: 5000,
        status: 'paid',
        gateway: 'stripe',
        paid_at: new Date('2025-01-15'),
        receipt_url: 'https://example.com/receipt',
        customer: {
          first_name: 'Jane',
          last_name: 'Smith',
          phone_e164: '+1234567890',
        },
        subscription: {
          plan_code: 'PREMIUM',
        },
        currency: {
          code: 'USD',
        },
        tenant: {
          name: 'FitCoach',
          tenant_branding: [
            {
              logo_url: 'https://example.com/logo.png',
              primary_color: '#000000',
              whatsapp_number: '+1234567890',
            },
          ],
        },
      };

      prisma.payments.findUnique.mockResolvedValue(mockPayment);
      (pdfGenerator.pdfGenerator.generateInvoicePDF as jest.Mock).mockResolvedValue(
        'https://blob.vercel-storage.com/invoice.pdf'
      );

      const req = new NextRequest('http://localhost:3000/api/export/invoice', {
        method: 'POST',
        body: JSON.stringify({ invoiceId: '1' }),
      });

      const response = await InvoicePOST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.pdfUrl).toBeDefined();
      expect(pdfGenerator.pdfGenerator.generateInvoicePDF).toHaveBeenCalled();
    });

    it('should return 400 if invoiceId is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/export/invoice', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await InvoicePOST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('invoiceId is required');
    });
  });

  describe('POST /api/export/plan', () => {
    it('should generate workout plan PDF successfully', async () => {
      const mockTrainingPlan = {
        id: BigInt(1),
        version: 1,
        split: 'Upper/Lower',
        notes: 'Follow the plan',
        customer: {
          first_name: 'Mike',
          last_name: 'Johnson',
          phone_e164: '+1234567890',
        },
        created_by_team_member: {
          full_name: 'Coach Smith',
        },
        training_plan_exercises: [
          {
            sets: 3,
            reps: 10,
            order_index: 0,
            exercise: {
              name: 'Bench Press',
              description: 'Chest exercise',
              equipment_needed: 'Barbell',
            },
          },
        ],
        tenant: {
          name: 'FitCoach',
          tenant_branding: [],
        },
      };

      prisma.training_plans.findUnique.mockResolvedValue(mockTrainingPlan);
      (pdfGenerator.pdfGenerator.generateWorkoutPlanPDF as jest.Mock).mockResolvedValue(
        'https://blob.vercel-storage.com/workout-plan.pdf'
      );

      const req = new NextRequest('http://localhost:3000/api/export/plan', {
        method: 'POST',
        body: JSON.stringify({ planId: '1', type: 'workout' }),
      });

      const response = await PlanPOST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.pdfUrl).toBeDefined();
      expect(pdfGenerator.pdfGenerator.generateWorkoutPlanPDF).toHaveBeenCalled();
    });

    it('should generate nutrition plan PDF successfully', async () => {
      const mockNutritionPlan = {
        id: BigInt(1),
        version: 1,
        calories_target: 2000,
        notes: 'Follow the meal plan',
        customer: {
          first_name: 'Sarah',
          last_name: 'Williams',
          phone_e164: '+1234567890',
        },
        created_by_team_member: {
          full_name: 'Coach Smith',
        },
        nutrition_plan_macros: [
          {
            calories: 2000,
            protein_g: 150,
            carbs_g: 200,
            fat_g: 60,
          },
        ],
        nutrition_meals: [
          {
            meal_name: 'Breakfast',
            notes: 'Start your day right',
            order_index: 0,
            nutrition_meal_items: [
              {
                food_name: 'Oatmeal',
                portion_size: 100,
                calories: 350,
                protein_g: 10,
                carbs_g: 60,
                fat_g: 5,
                order_index: 0,
              },
            ],
          },
        ],
        tenant: {
          name: 'FitCoach',
          tenant_branding: [],
        },
      };

      prisma.nutrition_plans.findUnique.mockResolvedValue(mockNutritionPlan);
      (pdfGenerator.pdfGenerator.generateNutritionPlanPDF as jest.Mock).mockResolvedValue(
        'https://blob.vercel-storage.com/nutrition-plan.pdf'
      );

      const req = new NextRequest('http://localhost:3000/api/export/plan', {
        method: 'POST',
        body: JSON.stringify({ planId: '1', type: 'nutrition' }),
      });

      const response = await PlanPOST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.pdfUrl).toBeDefined();
      expect(pdfGenerator.pdfGenerator.generateNutritionPlanPDF).toHaveBeenCalled();
    });

    it('should return 400 if type is invalid', async () => {
      const req = new NextRequest('http://localhost:3000/api/export/plan', {
        method: 'POST',
        body: JSON.stringify({ planId: '1', type: 'invalid' }),
      });

      const response = await PlanPOST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });
});
