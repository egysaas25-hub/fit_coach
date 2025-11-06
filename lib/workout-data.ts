import { WorkoutProgram, WorkoutTemplate, Exercise } from "@/types/workout"

export const workoutProgramsData: WorkoutProgram[] = [
  { 
    id: 1,
    name: "Beginner Strength", 
    clients: 24, 
    duration: "8 weeks",
    difficulty: "Beginner",
    goal: "Build Strength",
    workoutsPerWeek: 3,
    description: "Perfect introduction to strength training with foundational exercises"
  },
  { 
    id: 2,
    name: "Advanced Hypertrophy", 
    clients: 18, 
    duration: "12 weeks",
    difficulty: "Advanced",
    goal: "Muscle Growth",
    workoutsPerWeek: 5,
    description: "High-volume training for maximum muscle development"
  },
  { 
    id: 3,
    name: "Fat Loss Program", 
    clients: 32, 
    duration: "6 weeks",
    difficulty: "Intermediate",
    goal: "Fat Loss",
    workoutsPerWeek: 4,
    description: "High-intensity workouts combined with metabolic conditioning"
  },
  { 
    id: 4,
    name: "Athletic Performance", 
    clients: 15, 
    duration: "10 weeks",
    difficulty: "Advanced",
    goal: "Athletic Performance",
    workoutsPerWeek: 4,
    description: "Sport-specific training for enhanced athletic capabilities"
  },
  { 
    id: 5,
    name: "Home Workout Plan", 
    clients: 28, 
    duration: "8 weeks",
    difficulty: "Beginner",
    goal: "General Fitness",
    workoutsPerWeek: 3,
    description: "Effective workouts requiring minimal equipment"
  },
  { 
    id: 6,
    name: "Powerlifting Protocol", 
    clients: 12, 
    duration: "16 weeks",
    difficulty: "Advanced",
    goal: "Build Strength",
    workoutsPerWeek: 4,
    description: "Specialized program for squat, bench, and deadlift progression"
  },
]

export const workoutTemplatesData: WorkoutTemplate[] = [
  {
    id: 1,
    name: "Full Body Strength",
    type: "Strength",
    exercises: 8,
    duration: "60 min",
    description: "Comprehensive workout targeting all major muscle groups",
    difficulty: "Intermediate"
  },
  {
    id: 2,
    name: "Upper Body Blast",
    type: "Hypertrophy",
    exercises: 10,
    duration: "75 min",
    description: "Intense upper body workout for maximum muscle growth",
    difficulty: "Advanced"
  },
  {
    id: 3,
    name: "Cardio Blast",
    type: "Cardio",
    exercises: 6,
    duration: "45 min",
    description: "High-intensity cardio for fat loss and conditioning",
    difficulty: "Beginner"
  },
  {
    id: 4,
    name: "Core Crusher",
    type: "Core",
    exercises: 8,
    duration: "30 min",
    description: "Focused core training for stability and strength",
    difficulty: "Intermediate"
  },
  {
    id: 5,
    name: "Leg Day Destroyer",
    type: "Strength",
    exercises: 7,
    duration: "90 min",
    description: "Comprehensive lower body workout",
    difficulty: "Advanced"
  },
  {
    id: 6,
    name: "Yoga Flow",
    type: "Flexibility",
    exercises: 12,
    duration: "60 min",
    description: "Mindful movement for flexibility and balance",
    difficulty: "Beginner"
  },
]

export const exerciseLibraryData: Exercise[] = [
  { id: 1, name: "Barbell Squat", category: "Lower Body", equipment: "Barbell", difficulty: "Intermediate" },
  { id: 2, name: "Bench Press", category: "Upper Body", equipment: "Barbell", difficulty: "Beginner" },
  { id: 3, name: "Deadlift", category: "Lower Body", equipment: "Barbell", difficulty: "Intermediate" },
  { id: 4, name: "Pull-ups", category: "Upper Body", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: 5, name: "Dumbbell Rows", category: "Upper Body", equipment: "Dumbbell", difficulty: "Beginner" },
  { id: 6, name: "Lunges", category: "Lower Body", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: 7, name: "Shoulder Press", category: "Upper Body", equipment: "Dumbbell", difficulty: "Beginner" },
  { id: 8, name: "Plank", category: "Core", equipment: "Bodyweight", difficulty: "Beginner" },
]
