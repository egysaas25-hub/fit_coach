import { Database } from './database';
import { hashPassword } from '@/lib/auth/password';

const mockPassword = 'password123';
const mockPasswordHash = hashPassword(mockPassword);

const now = new Date();
const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

const users = [
  {
    id: 'user-c1',
    email: 'client1@example.com',
    name: 'Alice Client',
    role: 'client',
    passwordHash: mockPasswordHash,
    createdAt: monthAgo,
    updatedAt: monthAgo,
  },
  {
    id: 'user-c2',
    email: 'client2@example.com',
    name: 'Bob Client',
    role: 'client',
    passwordHash: mockPasswordHash,
    createdAt: monthAgo,
    updatedAt: monthAgo,
  },
  {
    id: 'user-c3',
    email: 'client3@example.com',
    name: 'Carol Client',
    role: 'client',
    passwordHash: mockPasswordHash,
    createdAt: weekAgo,
    updatedAt: weekAgo,
  },
  {
    id: 'user-t1',
    email: 'trainer1@example.com',
    name: 'Charles Trainer',
    role: 'trainer',
    passwordHash: mockPasswordHash,
    createdAt: monthAgo,
    updatedAt: monthAgo,
  },
  {
    id: 'user-t2',
    email: 'trainer2@example.com',
    name: 'Diana Trainer',
    role: 'trainer',
    passwordHash: mockPasswordHash,
    createdAt: monthAgo,
    updatedAt: monthAgo,
  },
  {
    id: 'user-a1',
    email: 'admin1@example.com',
    name: 'Admin User',
    role: 'admin',
    passwordHash: mockPasswordHash,
    createdAt: monthAgo,
    updatedAt: monthAgo,
  },
];

const clients = [
  { ...users[0], trainerId: 'user-t1' },
  { ...users[1], trainerId: 'user-t1' },
  { ...users[2], trainerId: 'user-t2' },
];

const trainers = [{ ...users[3] }, { ...users[4] }];

const workouts = [
  {
    id: 'workout-1',
    name: 'Beginner Strength',
    creatorId: 'user-t1',
    exercises: [
      { name: 'Squats', sets: 3, reps: 10, rest: 60 },
      { name: 'Push-ups', sets: 3, reps: 12, rest: 45 },
      { name: 'Lunges', sets: 3, reps: 10, rest: 60 },
    ],
    createdAt: monthAgo,
    updatedAt: monthAgo,
  },
  {
    id: 'workout-2',
    name: 'Intermediate Cardio',
    creatorId: 'user-t1',
    exercises: [
      { name: 'Running', duration: 30, intensity: 'moderate' },
      { name: 'Jump Rope', duration: 10, intensity: 'high' },
    ],
    createdAt: monthAgo,
    updatedAt: monthAgo,
  },
  {
    id: 'workout-3',
    name: 'Advanced HIIT',
    creatorId: 'user-t2',
    exercises: [
      { name: 'Burpees', sets: 4, reps: 15, rest: 30 },
      { name: 'Mountain Climbers', sets: 4, reps: 20, rest: 30 },
      { name: 'Box Jumps', sets: 4, reps: 12, rest: 45 },
    ],
    createdAt: weekAgo,
    updatedAt: weekAgo,
  },
];

const workoutLogs = [
  {
    id: 'log-w1',
    workoutId: 'workout-1',
    clientId: 'user-c1',
    dateCompleted: dayAgo,
    performanceMetrics: { totalSets: 9, avgRest: 55, completed: true },
    createdAt: dayAgo,
    updatedAt: dayAgo,
  },
  {
    id: 'log-w2',
    workoutId: 'workout-2',
    clientId: 'user-c1',
    dateCompleted: new Date(dayAgo.getTime() - 2 * 24 * 60 * 60 * 1000),
    performanceMetrics: { totalDuration: 40, avgHeartRate: 145 },
    createdAt: new Date(dayAgo.getTime() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(dayAgo.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'log-w3',
    workoutId: 'workout-1',
    clientId: 'user-c2',
    dateCompleted: dayAgo,
    performanceMetrics: { totalSets: 9, avgRest: 60, completed: true },
    createdAt: dayAgo,
    updatedAt: dayAgo,
  },
  {
    id: 'log-w4',
    workoutId: 'workout-3',
    clientId: 'user-c3',
    dateCompleted: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000),
    performanceMetrics: { totalSets: 12, avgRest: 35, intensity: 'high' },
    createdAt: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000),
  },
];

const nutritionPlans = [
  {
    id: 'np-1',
    name: 'Balanced Diet',
    creatorId: 'user-t1',
    createdAt: monthAgo,
    updatedAt: monthAgo,
  },
  {
    id: 'np-2',
    name: 'High-Protein',
    creatorId: 'user-t1',
    createdAt: monthAgo,
    updatedAt: monthAgo,
  },
  {
    id: 'np-3',
    name: 'Low-Carb',
    creatorId: 'user-t2',
    createdAt: weekAgo,
    updatedAt: weekAgo,
  },
];

const nutritionLogs = [
  {
    id: 'log-n1',
    planId: 'np-1',
    clientId: 'user-c1',
    dateLogged: dayAgo,
    adherence: 'high',
    createdAt: dayAgo,
    updatedAt: dayAgo,
  },
  {
    id: 'log-n2',
    planId: 'np-2',
    clientId: 'user-c2',
    dateLogged: dayAgo,
    adherence: 'medium',
    createdAt: dayAgo,
    updatedAt: dayAgo,
  },
  {
    id: 'log-n3',
    planId: 'np-1',
    clientId: 'user-c1',
    dateLogged: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000),
    adherence: 'high',
    createdAt: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'log-n4',
    planId: 'np-3',
    clientId: 'user-c3',
    dateLogged: new Date(dayAgo.getTime() - 2 * 24 * 60 * 60 * 1000),
    adherence: 'low',
    createdAt: new Date(dayAgo.getTime() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(dayAgo.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
];

const progressEntries = [
  {
    id: 'prog-1',
    clientId: 'user-c1',
    metric: 'weight',
    value: 75.5,
    date: monthAgo,
    createdAt: monthAgo,
    updatedAt: monthAgo,
  },
  {
    id: 'prog-2',
    clientId: 'user-c1',
    metric: 'weight',
    value: 74.8,
    date: new Date(monthAgo.getTime() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(monthAgo.getTime() + 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(monthAgo.getTime() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'prog-3',
    clientId: 'user-c1',
    metric: 'weight',
    value: 74.2,
    date: new Date(monthAgo.getTime() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(monthAgo.getTime() + 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(monthAgo.getTime() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'prog-4',
    clientId: 'user-c1',
    metric: 'weight',
    value: 73.5,
    date: new Date(monthAgo.getTime() + 21 * 24 * 60 * 60 * 1000),
    createdAt: new Date(monthAgo.getTime() + 21 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(monthAgo.getTime() + 21 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'prog-5',
    clientId: 'user-c1',
    metric: 'bodyfat',
    value: 22.5,
    date: monthAgo,
    createdAt: monthAgo,
    updatedAt: monthAgo,
  },
  {
    id: 'prog-6',
    clientId: 'user-c1',
    metric: 'bodyfat',
    value: 21.8,
    date: new Date(monthAgo.getTime() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(monthAgo.getTime() + 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(monthAgo.getTime() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'prog-7',
    clientId: 'user-c2',
    metric: 'weight',
    value: 82.3,
    date: monthAgo,
    createdAt: monthAgo,
    updatedAt: monthAgo,
  },
  {
    id: 'prog-8',
    clientId: 'user-c2',
    metric: 'weight',
    value: 83.1,
    date: new Date(monthAgo.getTime() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(monthAgo.getTime() + 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(monthAgo.getTime() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'prog-9',
    clientId: 'user-c2',
    metric: 'weight',
    value: 83.8,
    date: new Date(monthAgo.getTime() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(monthAgo.getTime() + 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(monthAgo.getTime() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'prog-10',
    clientId: 'user-c3',
    metric: 'weight',
    value: 68.5,
    date: weekAgo,
    createdAt: weekAgo,
    updatedAt: weekAgo,
  },
];

const appointments = [
  {
    id: 'appt-1',
    clientId: 'user-c1',
    trainerId: 'user-t1',
    date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
    status: 'scheduled',
    createdAt: weekAgo,
    updatedAt: weekAgo,
  },
  {
    id: 'appt-2',
    clientId: 'user-c2',
    trainerId: 'user-t1',
    date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    status: 'scheduled',
    createdAt: weekAgo,
    updatedAt: weekAgo,
  },
  {
    id: 'appt-3',
    clientId: 'user-c1',
    trainerId: 'user-t1',
    date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    status: 'completed',
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'appt-4',
    clientId: 'user-c3',
    trainerId: 'user-t2',
    date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
    status: 'scheduled',
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'appt-5',
    clientId: 'user-c2',
    trainerId: 'user-t1',
    date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    status: 'cancelled',
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
  },
];

const messageThreads = [
  {
    id: 'thread-1',
    clientId: 'user-c1',
    trainerId: 'user-t1',
    createdAt: weekAgo,
    updatedAt: dayAgo,
  },
  {
    id: 'thread-2',
    clientId: 'user-c2',
    trainerId: 'user-t1',
    createdAt: weekAgo,
    updatedAt: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'thread-3',
    clientId: 'user-c3',
    trainerId: 'user-t2',
    createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
];

const messages = [
  {
    id: 'msg-1',
    threadId: 'thread-1',
    senderId: 'user-c1',
    content: 'Hi! Can we reschedule my session?',
    createdAt: dayAgo,
    updatedAt: dayAgo,
  },
  {
    id: 'msg-2',
    threadId: 'thread-1',
    senderId: 'user-t1',
    content: 'Of course! When works best for you?',
    createdAt: new Date(dayAgo.getTime() + 30 * 60 * 1000),
    updatedAt: new Date(dayAgo.getTime() + 30 * 60 * 1000),
  },
  {
    id: 'msg-3',
    threadId: 'thread-1',
    senderId: 'user-c1',
    content: 'How about Thursday at 3pm?',
    createdAt: new Date(dayAgo.getTime() + 45 * 60 * 1000),
    updatedAt: new Date(dayAgo.getTime() + 45 * 60 * 1000),
  },
  {
    id: 'msg-4',
    threadId: 'thread-2',
    senderId: 'user-c2',
    content: 'I have a question about my nutrition plan',
    createdAt: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'msg-5',
    threadId: 'thread-2',
    senderId: 'user-t1',
    content: "Sure! What's your question?",
    createdAt: new Date(
      dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000
    ),
    updatedAt: new Date(
      dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000
    ),
  },
{
    id: 'msg-6',
    threadId: 'thread-3',
    senderId: 'user-c3',
    content: 'Thanks for the new workout plan!',
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'msg-7',
    threadId: 'thread-3',
    senderId: 'user-t2',
    content: 'You\'re welcome! Let me know how it goes.',
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
  },
];

const notifications = [
  {
    id: 'notif-1',
    userId: 'user-c1',
    message: 'Your appointment with Charles Trainer is tomorrow at 3pm',
    read: false,
    createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'notif-2',
    userId: 'user-c1',
    message: 'New workout plan assigned: Beginner Strength',
    read: true,
    createdAt: weekAgo,
    updatedAt: new Date(weekAgo.getTime() + 2 * 60 * 60 * 1000),
  },
  {
    id: 'notif-3',
    userId: 'user-c2',
    message: 'Don\'t forget to log your meals today!',
    read: false,
    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'notif-4',
    userId: 'user-c2',
    message: 'Your trainer replied to your message',
    read: false,
    createdAt: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000),
    updatedAt: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000),
  },
  {
    id: 'notif-5',
    userId: 'user-c3',
    message: 'Great job completing your workout!',
    read: true,
    createdAt: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(dayAgo.getTime() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
  },
  {
    id: 'notif-6',
    userId: 'user-t1',
    message: 'You have 2 appointments scheduled for tomorrow',
    read: false,
    createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'notif-7',
    userId: 'user-t1',
    message: 'New client assigned: Carol Client',
    read: true,
    createdAt: weekAgo,
    updatedAt: new Date(weekAgo.getTime() + 1 * 60 * 60 * 1000),
  },
];

export const seedData: Partial<Database> = {
  users,
  clients,
  trainers,
  workouts,
  workoutLogs,
  nutritionPlans,
  nutritionLogs,
  progressEntries,
  appointments,
  messageThreads,
  messages,
  notifications,
  webhooks: [],
};