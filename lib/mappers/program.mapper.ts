// lib/mappers/program.mapper.ts
import { Program, ProgramWeek, ProgramDay, ProgramExercise, ProgramDifficulty, ProgramGoal } from '@/types/domain/program';

interface RawProgram {
  program_id: string;
  name: string;
  description: string;
  duration_weeks: number;
  goal: string;
  difficulty: string;
  weeks: RawProgramWeek[];
  created_at: string;
  updated_at: string;
}

interface RawProgramWeek {
  week_id: string;
  name: string;
  program_id: string;
  days: RawProgramDay[];
}

interface RawProgramDay {
  day_id: string;
  name: string;
  week_id: string;
  exercises: RawProgramExercise[];
}

interface RawProgramExercise {
  exercise_id: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  notes?: string;
  category?: string;
}

export class ProgramMapper {
  static toDomainProgram(raw: RawProgram): Program {
    return {
      id: raw.program_id,
      name: raw.name,
      description: raw.description,
      durationWeeks: raw.duration_weeks,
      goal: raw.goal as ProgramGoal,
      difficulty: raw.difficulty as ProgramDifficulty,
      weeks: raw.weeks.map(this.toDomainWeek),
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }

  static toDomainPrograms(rawPrograms: RawProgram[]): Program[] {
    return rawPrograms.map(this.toDomainProgram);
  }

  static toDomainWeek(raw: RawProgramWeek): ProgramWeek {
    return {
      id: raw.week_id,
      name: raw.name,
      programId: raw.program_id,
      days: raw.days.map(this.toDomainDay),
    };
  }

  static toDomainDay(raw: RawProgramDay): ProgramDay {
    return {
      id: raw.day_id,
      name: raw.name,
      weekId: raw.week_id,
      exercises: raw.exercises.map(this.toDomainExercise),
    };
  }

  static toDomainExercise(raw: RawProgramExercise): ProgramExercise {
    return {
      id: raw.exercise_id,
      name: raw.name,
      sets: raw.sets,
      reps: raw.reps,
      rest: raw.rest,
      notes: raw.notes,
      category: raw.category,
    };
  }
}