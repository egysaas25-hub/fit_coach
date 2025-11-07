export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroup: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
  variations?: string[];
  isFavorite: boolean;
  usageCount: number;
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

export interface WorkoutState {
  workouts: Workout[];
  selectedWorkout: Workout | null;
  loading: boolean;
  error: string | null;
  fetchWorkouts: (customerId?: string) => Promise<void>;
  setSelectedWorkout: (workout: Workout | null) => void;
}
