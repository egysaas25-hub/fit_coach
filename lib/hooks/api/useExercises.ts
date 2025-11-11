// lib/hooks/api/useExercises.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExerciseService } from '@/lib/api/services/exercise.service';
import { 
  Exercise,
  ExerciseCategory,
  ExerciseEquipment
} from '@/types/domain/exercise';

const exerciseService = new ExerciseService();

/**
 * Hook for exercises
 * Rule 1: Component calls hook
 * Rule 2: Hook calls service
 */
export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: () => exerciseService.getExercises(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for searching exercises
 */
export function useSearchExercises(query: string) {
  return useQuery({
    queryKey: ['exercises', 'search', query],
    queryFn: () => exerciseService.searchExercises(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!query,
  });
}

/**
 * Hook for exercise categories
 */
export function useExerciseCategories() {
  return useQuery({
    queryKey: ['exercises', 'categories'],
    queryFn: () => exerciseService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for exercise equipment
 */
export function useExerciseEquipment() {
  return useQuery({
    queryKey: ['exercises', 'equipment'],
    queryFn: () => exerciseService.getEquipment(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to create a new exercise
 */
export function useCreateExercise() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>) => 
      exerciseService.createExercise(exercise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

/**
 * Hook to update an existing exercise
 */
export function useUpdateExercise() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, exercise }: { id: string; exercise: Partial<Exercise> }) => 
      exerciseService.updateExercise(id, exercise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

/**
 * Hook to delete an exercise
 */
export function useDeleteExercise() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => exerciseService.deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}