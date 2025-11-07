import { Database } from './database';
import { hashPassword } from '@/lib/auth/password';

const mockPassword = 'password123';
const mockPasswordHash = hashPassword(mockPassword);

const users = [
    { id: 'user-c1', email: 'client1@example.com', name: 'Alice Client', role: 'client', passwordHash: mockPasswordHash },
    { id: 'user-c2', email: 'client2@example.com', name: 'Bob Client', role: 'client', passwordHash: mockPasswordHash },
    { id: 'user-t1', email: 'trainer1@example.com', name: 'Charles Trainer', role: 'trainer', passwordHash: mockPasswordHash },
    { id: 'user-a1', email: 'admin1@example.com', name: 'Diana Admin', role: 'admin', passwordHash: mockPasswordHash },
];

const clients = [
    { ...users[0], trainerId: 'user-t1' },
    { ...users[1], trainerId: 'user-t1' },
];

const trainers = [
    { ...users[2] },
];

const workouts = [
    { id: 'workout-1', name: 'Beginner Strength', creatorId: 'user-t1', exercises: [{ name: 'Squats', sets: 3, reps: 10 }] },
    { id: 'workout-2', name: 'Intermediate Cardio', creatorId: 'user-t1', exercises: [{ name: 'Running', duration: 30 }] },
];

const nutritionPlans = [
    { id: 'np-1', name: 'Balanced Diet', creatorId: 'user-t1' },
    { id: 'np-2', name: 'High-Protein', creatorId: 'user-t1' },
];

// In a real application, you would generate more realistic data.
export const seedData: Partial<Database> = {
    users: users.map(u => ({ ...u, createdAt: new Date(), updatedAt: new Date() })),
    clients: clients.map(c => ({ ...c, createdAt: new Date(), updatedAt: new Date() })),
    trainers: trainers.map(t => ({ ...t, createdAt: new Date(), updatedAt: new Date() })),
    workouts: workouts.map(w => ({ ...w, createdAt: new Date(), updatedAt: new Date() })),
    nutritionPlans: nutritionPlans.map(np => ({ ...np, createdAt: new Date(), updatedAt: new Date() })),
    workoutLogs: [],
    nutritionLogs: [],
    progressEntries: [],
    appointments: [],
    messages: [],
    messageThreads: [],
    notifications: [],
};
