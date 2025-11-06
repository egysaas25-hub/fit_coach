// lib/schemas/nutrition/nutrition.schema.ts
import { z } from 'zod';
import { idSchema, dateValidation } from '@/lib/schemas/common/common.schema';

export const createMealPlanSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(1000).optional(),
  type: z.enum(['Weight Loss', 'Muscle Gain', 'Maintenance']),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fats: z.number().min(0),
  meals: z.array(z.object({
    name: z.string().min(1, 'Meal name is required'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    foods: z.array(z.object({
      name: z.string().min(1, 'Food name is required'),
      quantity: z.number().min(0),
      calories: z.number().min(0),
      protein: z.number().min(0),
      carbs: z.number().min(0),
      fat: z.number().min(0),
    })),
  })),
});

export const mealSchema = z.object({
  name: z.string().min(1, 'Meal name is required'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  foods: z.array(z.object({
    name: z.string().min(1, 'Food name is required'),
    quantity: z.number().min(0),
    calories: z.number().min(0),
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
  })),
});

export const foodItemSchema = z.object({
  name: z.string().min(1, 'Food name is required'),
  quantity: z.number().min(0),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
});

export const nutritionTemplateSchema = z.object({
  type: z.enum(['Weight Loss', 'Muscle Gain', 'Maintenance']),
  description: z.string().max(1000).optional(),
  macros: z.object({
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fats: z.number().min(0),
  }),
  calories: z.number().min(0),
});

export const mealLogSchema = z.object({
  mealId: idSchema,
  foods: z.array(foodItemSchema),
  date: dateValidation,
  notes: z.string().max(1000).optional(),
});

export const nutritionGoalsSchema = z.object({
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fats: z.number().min(0),
});