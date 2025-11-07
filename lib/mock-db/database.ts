// A simple in-memory database
// NOTE: This is a mock database and will be reset on every server restart.

import { nanoid } from 'nanoid';

interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

// Dummy interfaces for now, to be replaced with actual models
export interface User extends BaseEntity { email: string; name: string; role: string; }
export interface Client extends User { trainerId: string; }
export interface Trainer extends User {}
export interface Workout extends BaseEntity { name: string; }
export interface WorkoutLog extends BaseEntity { workoutId: string; clientId: string; }
export interface NutritionPlan extends BaseEntity { name: string; }
export interface NutritionLog extends BaseEntity { planId: string; clientId: string; }
export interface ProgressEntry extends BaseEntity { clientId: string; }
export interface Appointment extends BaseEntity { clientId: string; trainerId: string; }
export interface Message extends BaseEntity { threadId: string; }
export interface MessageThread extends BaseEntity {}
export interface Notification extends BaseEntity { userId: string; }


// Core database structure
export interface Database {
  users: User[]
  clients: Client[]
  trainers: Trainer[]
  workouts: Workout[]
  workoutLogs: WorkoutLog[]
  nutritionPlans: NutritionPlan[]
  nutritionLogs: NutritionLog[]
  progressEntries: ProgressEntry[]
  appointments: Appointment[]
  messages: Message[]
  messageThreads: MessageThread[]
  notifications: Notification[]
}

// In-memory database, initialized with empty arrays
let db: Database = {
    users: [],
    clients: [],
    trainers: [],
    workouts: [],
    workoutLogs: [],
    nutritionPlans: [],
    nutritionLogs: [],
    progressEntries: [],
    appointments: [],
    messages: [],
    messageThreads: [],
    notifications: []
};

// CRUD operations
export const database = {
  get: <T extends { id: string }>(table: key of Database, id: string): T | undefined => {
    const tableData = db[table] as T[];
    return tableData.find((item) => item.id === id);
  },
  getAll: <T>(table: keyof Database, filters?: Record<string, any>): T[] => {
    let results = db[table] as T[];
    if (filters) {
      results = results.filter((item: any) => {
        return Object.keys(filters).every((key) => {
          return item[key] === filters[key];
        });
      });
    }
    return results;
  },
  create: <T extends {}>(table: keyof Database, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T & { id: string; createdAt: Date; updatedAt: Date } => {
    const now = new Date();
    const newItem = {
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
      ...data,
    } as T & { id: string; createdAt: Date; updatedAt: Date };
    (db[table] as any[]).push(newItem);
    return newItem;
  },
  update: <T extends { id: string }>(table: keyof Database, id: string, data: Partial<T>): T | null => {
    const tableData = db[table] as T[];
    const itemIndex = tableData.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      const updatedItem = { ...tableData[itemIndex], ...data, updatedAt: new Date() };
      tableData[itemIndex] = updatedItem;
      return updatedItem;
    }
    return null;
  },
  // Soft delete can be implemented by adding a `deletedAt` field to the models
  delete: (table: keyof Database, id: string): boolean => {
    const tableData = db[table] as { id: string }[];
    const initialLength = tableData.length;
    db[table] = tableData.filter((item) => item.id !== id) as any;
    return db[table].length < initialLength;
  },
  query: <T>(table: keyof Database, predicate: (item: T) => boolean): T[] => {
    return (db[table] as T[]).filter(predicate);
  },
  init: (seedData: Partial<Database>) => {
    db = {
        ...db,
        ...JSON.parse(JSON.stringify(seedData))
    };
  }
};

export const initializeDatabase = (seedData: Partial<Database>) => {
    database.init(seedData);
};
