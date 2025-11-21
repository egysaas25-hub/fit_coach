/**
 * PDF Generator Service Tests
 * Tests for enhanced PDF generation functionality
 */

import { PDFGeneratorService } from '../../../lib/services/pdf-generator'

describe('PDFGeneratorService', () => {
  let pdfGenerator: PDFGeneratorService

  beforeEach(() => {
    pdfGenerator = new PDFGeneratorService()
  })

  describe('Progress Report PDF', () => {
    it('should generate progress report PDF with metrics', async () => {
      const params = {
        clientId: 'client_123',
        clientName: 'John Doe',
        clientCode: 'JD001',
        dateRange: {
          startDate: '2025-01-01',
          endDate: '2025-11-21'
        },
        metrics: {
          weight: [
            { date: '2025-01-01', value: 85 },
            { date: '2025-02-01', value: 83 },
            { date: '2025-03-01', value: 81 }
          ],
          bodyFat: [
            { date: '2025-01-01', value: 22 },
            { date: '2025-02-01', value: 20 },
            { date: '2025-03-01', value: 18 }
          ]
        },
        achievements: [
          'Lost 4kg in 3 months',
          'Reduced body fat by 4%'
        ],
        trainerName: 'Coach Mike',
        tenantBranding: {
          primaryColor: '#00C26A',
          companyName: 'FitCoach Pro'
        }
      }

      const result = await pdfGenerator.generateProgressReportPDF(params)
      
      expect(result).not.toBeNull()
      expect(typeof result).toBe('string')
      expect(result.includes('cdn.example.com')).toBe(true)
    })

    it('should handle progress report with photos', async () => {
      const params = {
        clientId: 'client_123',
        clientName: 'John Doe',
        clientCode: 'JD001',
        dateRange: {
          startDate: '2025-01-01',
          endDate: '2025-11-21'
        },
        metrics: {
          weight: [{ date: '2025-01-01', value: 85 }]
        },
        photos: {
          before: 'https://example.com/before.jpg',
          after: 'https://example.com/after.jpg'
        },
        trainerName: 'Coach Mike'
      }

      const result = await pdfGenerator.generateProgressReportPDF(params)
      
      expect(result).not.toBeNull()
    })
  })

  describe('Invoice PDF', () => {
    it('should generate invoice PDF with line items', async () => {
      const params = {
        invoiceId: 'inv_123',
        invoiceNumber: 'INV-2025-001',
        invoiceDate: '2025-11-21',
        dueDate: '2025-12-21',
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        lineItems: [
          {
            description: '3-Month Training Program',
            quantity: 1,
            unitPrice: 299.99,
            total: 299.99
          }
        ],
        subtotal: 299.99,
        total: 299.99,
        currency: 'USD',
        paymentStatus: 'paid' as const,
        tenantBranding: {
          primaryColor: '#00C26A',
          companyName: 'FitCoach Pro'
        }
      }

      const result = await pdfGenerator.generateInvoicePDF(params)
      
      expect(result).not.toBeNull()
      expect(typeof result).toBe('string')
    })

    it('should handle invoice with tax and discount', async () => {
      const params = {
        invoiceId: 'inv_124',
        invoiceNumber: 'INV-2025-002',
        invoiceDate: '2025-11-21',
        dueDate: '2025-12-21',
        clientName: 'Jane Smith',
        lineItems: [
          {
            description: 'Nutrition Plan',
            quantity: 1,
            unitPrice: 99.99,
            total: 99.99
          }
        ],
        subtotal: 99.99,
        tax: 10.00,
        discount: 5.00,
        total: 104.99,
        currency: 'USD',
        paymentStatus: 'pending' as const
      }

      const result = await pdfGenerator.generateInvoicePDF(params)
      
      expect(result).not.toBeNull()
    })
  })

  describe('Workout Plan PDF', () => {
    it('should generate workout plan PDF with exercises', async () => {
      const params = {
        planId: 'plan_123',
        planName: 'Strength Building Program',
        description: 'A comprehensive strength training program',
        durationWeeks: 12,
        workoutsPerWeek: 4,
        exercises: [
          {
            name: 'Barbell Bench Press',
            category: 'Chest',
            sets: 4,
            reps: '8-10',
            weight: '60kg',
            restSeconds: 90,
            instructions: 'Lower the bar to chest level'
          },
          {
            name: 'Squats',
            sets: 4,
            reps: '10-12',
            restSeconds: 120
          }
        ],
        clientName: 'John Doe',
        clientCode: 'JD001',
        trainerName: 'Coach Mike'
      }

      const result = await pdfGenerator.generateWorkoutPlanPDF(params)
      
      expect(result).not.toBeNull()
      expect(typeof result).toBe('string')
    })

    it('should handle workout plan with schedule', async () => {
      const params = {
        planId: 'plan_124',
        planName: 'Weekly Workout',
        workoutsPerWeek: 3,
        schedule: [
          { day: 'Mon', workoutName: 'Upper Body', duration: 60 },
          { day: 'Wed', workoutName: 'Lower Body', duration: 60 },
          { day: 'Fri', workoutName: 'Full Body', duration: 60 }
        ],
        exercises: [
          {
            name: 'Push-ups',
            sets: 3,
            reps: '15-20'
          }
        ],
        clientName: 'John Doe',
        clientCode: 'JD001',
        trainerName: 'Coach Mike'
      }

      const result = await pdfGenerator.generateWorkoutPlanPDF(params)
      
      expect(result).not.toBeNull()
    })
  })

  describe('Nutrition Plan PDF', () => {
    it('should generate nutrition plan PDF with meals', async () => {
      const params = {
        planId: 'plan_456',
        planName: 'Muscle Gain Nutrition Plan',
        description: 'High protein diet',
        targetCalories: 2800,
        macros: {
          protein: 200,
          carbs: 300,
          fat: 80
        },
        meals: [
          {
            name: 'Breakfast',
            time: '7:00 AM',
            foods: [
              {
                name: 'Oatmeal',
                quantity: '100g',
                calories: 389,
                protein: 17,
                carbs: 66,
                fat: 7
              }
            ],
            totalCalories: 389,
            totalProtein: 17,
            totalCarbs: 66,
            totalFat: 7
          }
        ],
        clientName: 'John Doe',
        clientCode: 'JD001',
        trainerName: 'Coach Mike'
      }

      const result = await pdfGenerator.generateNutritionPlanPDF(params)
      
      expect(result).not.toBeNull()
      expect(typeof result).toBe('string')
    })

    it('should handle nutrition plan with guidelines', async () => {
      const params = {
        planId: 'plan_457',
        planName: 'Weight Loss Plan',
        targetCalories: 1800,
        macros: {
          protein: 150,
          carbs: 180,
          fat: 60
        },
        meals: [
          {
            name: 'Lunch',
            time: '12:00 PM',
            foods: [],
            totalCalories: 500,
            totalProtein: 40,
            totalCarbs: 50,
            totalFat: 15
          }
        ],
        guidelines: [
          'Drink 3 liters of water daily',
          'Eat every 3-4 hours'
        ],
        clientName: 'Jane Smith',
        clientCode: 'JS001',
        trainerName: 'Coach Sarah'
      }

      const result = await pdfGenerator.generateNutritionPlanPDF(params)
      
      expect(result).not.toBeNull()
    })
  })

  describe('Legacy Plan PDF', () => {
    it('should generate legacy training plan PDF', async () => {
      const params = {
        planId: 'plan_789',
        planName: 'Legacy Training Plan',
        planType: 'training' as const,
        content: {
          type: 'training' as const,
          name: 'Legacy Plan',
          exercises: [
            {
              name: 'Deadlift',
              sets: 3,
              reps: '5',
              restSeconds: 180
            }
          ]
        },
        clientName: 'John Doe',
        clientCode: 'JD001',
        trainerName: 'Coach Mike'
      }

      const result = await pdfGenerator.generatePlanPDF(params)
      
      expect(result).not.toBeNull()
      expect(typeof result).toBe('string')
    })

    it('should generate legacy nutrition plan PDF', async () => {
      const params = {
        planId: 'plan_790',
        planName: 'Legacy Nutrition Plan',
        planType: 'nutrition' as const,
        content: {
          type: 'nutrition' as const,
          name: 'Legacy Plan',
          meals: [
            {
              name: 'Dinner',
              time: '6:00 PM',
              foods: [],
              total_calories: 600,
              total_protein: 50,
              total_carbs: 60,
              total_fat: 20
            }
          ],
          macros: {
            protein_percent: 30,
            carbs_percent: 40,
            fat_percent: 30,
            total_calories: 2000
          }
        },
        clientName: 'John Doe',
        clientCode: 'JD001',
        trainerName: 'Coach Mike'
      }

      const result = await pdfGenerator.generatePlanPDF(params)
      
      expect(result).not.toBeNull()
    })
  })
})
