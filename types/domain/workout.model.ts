export interface Exercise {
  id: number;
  tenantId: number;
  name: string; // Simplified from { en: string }
  createdAt: Date;
}

export interface TrainingPlanExercise {
  id: number;
  exerciseId: number;
  sets: number;
  reps: number;
  orderIndex: number;
  exercise: Exercise;
  totalReps: number; // Computed
}

export interface Workout {
  id: number;
  tenantId: number;
  customerId: string;
  version: number;
  isActive: boolean;
  split: string | null;
  notes: string | null;
  createdBy: number;
  createdAt: Date;
  trainingPlanExercises: TrainingPlanExercise[];
  totalSets: number; // Computed
  totalExercises: number; // Computed
}