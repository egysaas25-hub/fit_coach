// lib/schemas/workout/workout.schema.ts
import { z } from 'zod';
import { idSchema, dateValidation } from '@/lib/schemas/common/common.schema';
import { ProgramGoal, ProgramDifficulty } from '@/types/domain/program';

export const createWorkoutProgramSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(1000).optional(),
  duration: z.number().min(1, 'Duration must be at least 1 week'),
  goal: z.enum(Object.values(ProgramGoal) as [string, ...string[]]),
  difficulty: z.enum(Object.values(ProgramDifficulty) as [string, ...string[]]),
  weeks: z.array(z.object({
    name: z.string().min(1, 'Week name is required'),
    exercises: z.array(z.object({
      name: z.string().min(1, 'Exercise name is required'),
      sets: z.number().min(1),
      reps: z.string().min(1),
      weight: z.number().min(0).optional(),
      rest: z.number().min(0).optional(),
      notes: z.string().max(500).optional(),
    })),
  })),
});

export const workoutDaySchema = z.object({
  name: z.string().min(1, 'Day name is required'),
  exercises: z.array(z.object({
    name: z.string().min(1, 'Exercise name is required'),
    sets: z.number().min(1),
    reps: z.string().min(1),
    weight: z.number().min(0).optional(),
    rest: z.number().min(0).optional(),
    notes: z.string().max(500).optional(),
  })),
});

export const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.number().min(1),
  reps: z.string().min(1),
  weight: z.number().min(0).optional(),
  rest: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
});

export const workoutTemplateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  type: z.enum(['Strength', 'Cardio', 'Flexibility', 'Hybrid']),
  difficulty: z.enum(Object.values(ProgramDifficulty) as [string, ...string[]]),
  exercises: z.array(exerciseSchema),
  duration: z.number().min(1, 'Duration must be at least 1 week'),
});

export const workoutLogSchema = z.object({
  exerciseId: idSchema,
  sets: z.number().min(1),
  reps: z.string().min(1),
  weight: z.number().min(0).optional(),
  duration: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
});

export const workoutSessionSchema = z.object({
  programId: idSchema,
  date: dateValidation,
  exercises: z.array(exerciseSchema),
  duration: z.number().min(0).optional(),
  notes: z.string().max(1000).optional(),
});