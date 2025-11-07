import { Database } from './database';

// In a real application, you would generate more realistic data.
export const seedData: Partial<Database> = {
  users: [
    { id: 'user-1', email: 'client@example.com', name: 'Test Client', role: 'client', createdAt: new Date(), updatedAt: new Date() },
    { id: 'user-2', email: 'trainer@example.com', name: 'Test Trainer', role: 'trainer', createdAt: new Date(), updatedAt: new Date() },
    { id: 'user-3', email: 'admin@example.com', name: 'Test Admin', role: 'admin', createdAt: new Date(), updatedAt: new Date() },
  ],
  clients: [
    // The client ID should match a user ID.
    { id: 'user-1', email: 'client@example.com', name: 'Test Client', role: 'client', trainerId: 'user-2', createdAt: new Date(), updatedAt: new Date() },
  ],
  trainers: [
    // The trainer ID should match a user ID.
    { id: 'user-2', email: 'trainer@example.com', name: 'Test Trainer', role: 'trainer', createdAt: new Date(), updatedAt: new Date() },
  ],
  workouts: [],
  workoutLogs: [],
  nutritionPlans: [],
  nutritionLogs: [],
  progressEntries: [],
  appointments: [],
  messages: [],
  messageThreads: [],
  notifications: [],
};
