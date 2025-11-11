// types/domain/exercise.ts
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
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseEquipment {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  clientId: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  distance?: number;
  notes?: string;
  performedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}