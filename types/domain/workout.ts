export interface WorkoutProgram {
  id: number
  name: string
  clients: number
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  goal: string
  workoutsPerWeek: number
  description: string
}

export interface WorkoutTemplate {
  id: number
  name: string
  type: string
  exercises: number
  duration: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

export interface Exercise {
  id: number
  name: string
  category: string
  equipment: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

export interface WorkoutState {
  workouts: Workout[];
  selectedWorkout: Workout | null;
  fetchWorkouts: (customerId?: string) => Promise<void>;
  setSelectedWorkout: (workout: Workout | null) => void;
}
