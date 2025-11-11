import { saveDatabase, loadDatabase, scheduleSave } from './persistence';
import { advancedSearch } from '@/lib/utils/search';
import { paginate as paginateUtil, sortBy as sortByUtil } from '@/lib/utils/pagination';
import { z } from 'zod';
import {
  User,
  Client,
  Trainer,
  RoleType,
  AppointmentStatus,
  ProgressMetric,
  WebhookStatus,
  Workout,
  WorkoutLog,
  NutritionPlan,
  NutritionLog,
  ProgressEntry,
  Appointment,
  Message,
  MessageThread,
  Notification,
  Webhook,
  AuthAttempt,
  Session,
  Database
} from '@/types/lib/mock-db/types';

// Re-export types so existing imports continue to work
export type {
  User,
  Client,
  Trainer,
  RoleType,
  AppointmentStatus,
  ProgressMetric,
  WebhookStatus,
  Workout,
  WorkoutLog,
  NutritionPlan,
  NutritionLog,
  ProgressEntry,
  Appointment,
  Message,
  MessageThread,
  Notification,
  Webhook,
  AuthAttempt,
  Session,
  Database
};

const nanoid = () => Math.random().toString(36).slice(2);

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
  notifications: [],
  webhooks: [],
  authAttempts: [],
  sessions: [],
};

let dbState: { isDirty: boolean; lastSavedAt: Date | null; version: number } = {
  isDirty: false,
  lastSavedAt: null,
  version: 1,
};

export const database = {
  get: <T extends { id: string }>(
    table: keyof Database,
    id: string
  ): T | undefined => {
    const tableData = db[table] as unknown as T[];
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

  create: <T extends {}>(
    table: keyof Database,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): T & { id: string; createdAt: Date; updatedAt: Date } => {
    const now = new Date();
    const newItem = {
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
      ...data,
    } as T & { id: string; createdAt: Date; updatedAt: Date };
    (db[table] as any[]).push(newItem);
    dbState.isDirty = true;
    scheduleSave(db);
    return newItem;
  },

  update: <T extends { id: string }>(
    table: keyof Database,
    id: string,
    data: Partial<T>
  ): T | null => {
    const tableData = db[table] as unknown as T[];
    const itemIndex = tableData.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      const updatedItem = {
        ...tableData[itemIndex],
        ...data,
        updatedAt: new Date(),
      };
      tableData[itemIndex] = updatedItem;
      dbState.isDirty = true;
      scheduleSave(db);
      return updatedItem;
    }
    return null;
  },

  delete: (table: keyof Database, id: string): boolean => {
    const tableData = db[table] as { id: string }[];
    const initialLength = tableData.length;
    db[table] = tableData.filter((item) => item.id !== id) as any;
    const wasDeleted = db[table].length < initialLength;
    if (wasDeleted) {
      dbState.isDirty = true;
      scheduleSave(db);
    }
    return wasDeleted;
  },

  query: <T>(table: keyof Database, predicate: (item: T) => boolean): T[] => {
    return (db[table] as T[]).filter(predicate);
  },

  // NEW: Search functionality
  search: <T extends Record<string, any>>(
    table: keyof Database,
    searchTerm: string,
    fields: string[]
  ): T[] => {
    const tableData = db[table] as unknown as T[];
    return advancedSearch<T>(tableData, searchTerm, {
      fields,
      fuzzy: false,
      caseSensitive: false,
    });
  },

  // NEW: Pagination helper
  paginate: <T>(
    items: T[],
    page: number = 1,
    limit: number = 10
  ): {
    data: T[];
    pagination: { page: number; limit: number; total: number; pages: number };
  } => {
    const result = paginateUtil(items, page, limit);
    return result;
  },

  // NEW: Sort helper
  sort: <T extends Record<string, any>>(
    items: T[],
    field: string,
    order: 'asc' | 'desc' = 'asc'
  ): T[] => {
    return sortByUtil(items, field, order);
  },

  // NEW: Reset database
  reset: () => {
    db = {
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
      notifications: [],
      webhooks: [],
      authAttempts: [],
      sessions: [],
    };
  },

  init: (seedData: Partial<Database>) => {
    db = {
      ...db,
      ...JSON.parse(JSON.stringify(seedData)),
    };
  },

  // Persistence methods
  save: () => {
    const ok = saveDatabase(db);
    if (ok) {
      dbState.lastSavedAt = new Date();
      dbState.isDirty = false;
    }
    return ok;
  },

  load: () => {
    const loadedData = loadDatabase();
    if (loadedData) {
      // Validate basic structure using Zod (arrays only)
      const DatabaseSchema = z.object({
        users: z.array(z.any()).optional(),
        clients: z.array(z.any()).optional(),
        trainers: z.array(z.any()).optional(),
        workouts: z.array(z.any()).optional(),
        workoutLogs: z.array(z.any()).optional(),
        nutritionPlans: z.array(z.any()).optional(),
        nutritionLogs: z.array(z.any()).optional(),
        progressEntries: z.array(z.any()).optional(),
        appointments: z.array(z.any()).optional(),
        messages: z.array(z.any()).optional(),
        messageThreads: z.array(z.any()).optional(),
        notifications: z.array(z.any()).optional(),
        webhooks: z.array(z.any()).optional(),
        authAttempts: z.array(z.any()).optional(),
        sessions: z.array(z.any()).optional(),
      });

      const parsed = DatabaseSchema.safeParse(loadedData);
      if (!parsed.success) {
        console.error('Invalid database file format', parsed.error);
        return false;
      }

      db = {
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
        notifications: [],
        webhooks: [],
        authAttempts: [],
        sessions: [],
        ...parsed.data,
      };
      dbState.isDirty = false;
      return true;
    }
    return false;
  },

  export: () => {
    return db;
  },

  // Relations loader
  relations: {
    client: (id: string) => {
      const client = database.get<Client>('clients', id);
      if (!client) return null;
      const trainer = database.get<Trainer>('trainers', client.trainerId);
      const workouts = database.getAll<Workout>('workouts').filter(w => w.creatorId === trainer?.id);
      const workoutLogs = database.getAll<WorkoutLog>('workoutLogs').filter(l => l.clientId === id);
      const nutritionPlans = database.getAll<NutritionPlan>('nutritionPlans').filter(n => n.creatorId === trainer?.id);
      const nutritionLogs = database.getAll<NutritionLog>('nutritionLogs').filter(n => n.clientId === id);
      const progressEntries = database.getAll<ProgressEntry>('progressEntries').filter(p => p.clientId === id);
      const threads = database.getAll<MessageThread>('messageThreads').filter(t => t.clientId === id);
      const messages = database.getAll<Message>('messages').filter(m => threads.some(t => t.id === m.threadId));
      const notifications = database.getAll<Notification>('notifications').filter(n => n.userId === id);
      return { client, trainer, workouts, workoutLogs, nutritionPlans, nutritionLogs, progressEntries, threads, messages, notifications };
    },
    thread: (id: string) => {
      const thread = database.get<MessageThread>('messageThreads', id);
      if (!thread) return null;
      const client = database.get<Client>('clients', thread.clientId);
      const trainer = database.get<Trainer>('trainers', thread.trainerId);
      const messages = database.getAll<Message>('messages').filter(m => m.threadId === id);
      return { thread, client, trainer, messages };
    },
    workout: (id: string) => {
      const workout = database.get<Workout>('workouts', id);
      if (!workout) return null;
      const logs = database.getAll<WorkoutLog>('workoutLogs').filter(l => l.workoutId === id);
      const clients = database.getAll<Client>('clients').filter(c => logs.some(l => l.clientId === c.id));
      return { workout, logs, clients };
    },
  },

  // Database state helpers
  state: {
    get: () => dbState,
    markDirty: () => {
      dbState.isDirty = true;
    },
  },
};

export const initializeDatabase = (seedData: Partial<Database>) => {
  database.init(seedData);
};