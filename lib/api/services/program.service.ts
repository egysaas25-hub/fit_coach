// lib/api/services/program.service.ts
import { Program, ProgramWeek, ProgramExercise } from '@/types/domain/program';

export class ProgramService {
  async getPrograms(): Promise<Program[]> {
    try {
      const response = await fetch('/api/programs');
      const data = await response.json();
      return data as Program[];
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw new Error('Failed to fetch programs');
    }
  }

  async createProgram(program: Partial<Program>): Promise<Program> {
    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(program),
      });
      const data = await response.json();
      return data as Program;
    } catch (error) {
      console.error('Error creating program:', error);
      throw new Error('Failed to create program');
    }
  }

  async updateProgram(programId: string, updates: Partial<Program>): Promise<Program> {
    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      return data as Program;
    } catch (error) {
      console.error('Error updating program:', error);
      throw new Error('Failed to update program');
    }
  }

  async getProgramWeeks(programId: string): Promise<ProgramWeek[]> {
    try {
      const response = await fetch(`/api/programs/${programId}/weeks`);
      const data = await response.json();
      return data as ProgramWeek[];
    } catch (error) {
      console.error('Error fetching program weeks:', error);
      throw new Error('Failed to fetch program weeks');
    }
  }

  async getProgramExercises(programId: string, weekId: string): Promise<ProgramExercise[]> {
    try {
      const response = await fetch(`/api/programs/${programId}/weeks/${weekId}/exercises`);
      const data = await response.json();
      return data as ProgramExercise[];
    } catch (error) {
      console.error('Error fetching program exercises:', error);
      throw new Error('Failed to fetch program exercises');
    }
  }
}