// types/domain/program.ts
export interface Program {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
  goal: ProgramGoal;
  difficulty: ProgramDifficulty;
  weeks: ProgramWeek[];
  createdAt: string;
  updatedAt: string;
}

export interface ProgramWeek {
  id: string;
  name: string; // e.g., 'Week 1'
  programId: string;
  days: ProgramDay[];
}

export interface ProgramDay {
  id: string;
  name: string; // e.g., 'Day 1 - Upper Body'
  weekId: string;
  exercises: ProgramExercise[];
}

export interface ProgramExercise {
  id: string;
  name: string; // e.g., 'Barbell Squat'
  sets: number;
  reps: string; // e.g., '10-12'
  rest: number; // seconds
  notes?: string;
  category?: string; // e.g., 'Lower Body'
}

export enum ProgramDifficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export enum ProgramGoal {
  Strength = 'Strength',
  Hypertrophy = 'Hypertrophy',
  FatLoss = 'Fat Loss',
  Endurance = 'Endurance',
  Athletic = 'Athletic Performance',
}