// lib/hooks/api/useProgram.ts
import { useState, useEffect, useCallback } from 'react';
import { ProgramService } from '@/lib/api/services/program.service';
import { Program, ProgramWeek, ProgramExercise } from '@/types/domain/program';

const programService = new ProgramService();

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await programService.getPrograms();
      setPrograms(data);
    } catch (err) {
      setError('Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return { programs, loading, error, refetch: fetchPrograms };
}

export function useCreateProgram() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProgram = useCallback(async (program: Partial<Program>) => {
    setLoading(true);
    try {
      const newProgram = await programService.createProgram(program);
      return newProgram;
    } catch (err) {
      setError('Failed to create program');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createProgram, loading, error };
}

export function useUpdateProgram() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgram = useCallback(async (programId: string, updates: Partial<Program>) => {
    setLoading(true);
    try {
      const updatedProgram = await programService.updateProgram(programId, updates);
      return updatedProgram;
    } catch (err) {
      setError('Failed to update program');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateProgram, loading, error };
}

export function useProgramWeeks(programId: string) {
  const [weeks, setWeeks] = useState<ProgramWeek[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeeks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await programService.getProgramWeeks(programId);
      setWeeks(data);
    } catch (err) {
      setError('Failed to fetch program weeks');
    } finally {
      setLoading(false);
    }
  }, [programId]);

  useEffect(() => {
    fetchWeeks();
  }, [fetchWeeks]);

  return { weeks, loading, error, refetch: fetchWeeks };
}

export function useProgramExercises(programId: string, weekId: string) {
  const [exercises, setExercises] = useState<ProgramExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      const data = await programService.getProgramExercises(programId, weekId);
      setExercises(data);
    } catch (err) {
      setError('Failed to fetch program exercises');
    } finally {
      setLoading(false);
    }
  }, [programId, weekId]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return { exercises, loading, error, refetch: fetchExercises };
}