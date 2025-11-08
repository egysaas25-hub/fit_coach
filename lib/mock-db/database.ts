import { nanoid } from 'nanoid';

interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: string;
  passwordHash: string;
}
export interface Client extends User {
  trainerId: string;
}
export interface Trainer extends User {}
export interface Workout extends BaseEntity {
  name: string;
  creatorId: string;
  exercises: any[];
}
export interface WorkoutLog extends BaseEntity {
  workoutId: string;
  clientId: string;
  dateCompleted: Date;
  performanceMetrics?: any;
}
export interface NutritionPlan extends BaseEntity {
  name: string;
  creatorId: string;
}
export interface NutritionLog extends BaseEntity {
  planId: string;
  clientId: string;
  dateLogged: Date;
  adherence?: string;
}
export interface ProgressEntry extends BaseEntity {
  clientId: string;
  metric: string;
  value: number;
  date: Date;
}
export interface Appointment extends BaseEntity {
  clientId: string;
  trainerId: string;
  date: Date;
  status: string;
}
export interface Message extends BaseEntity {
  threadId: string;
  senderId: string;
  content: string;
}
export interface MessageThread extends BaseEntity {
  clientId: string;
  trainerId: string;
}
export interface Notification extends BaseEntity {
  userId: string;
  message: string;
  read: boolean;
}
export interface Webhook extends BaseEntity {
  name: string;
  url: string;
  events: string[];
  status: string;
  secret: string;
}

export interface Database {
  users: User[];
  clients: Client[];
  trainers: Trainer[];
  workouts: Workout[];
  workoutLogs: WorkoutLog[];
  nutritionPlans: NutritionPlan[];
  nutritionLogs: NutritionLog[];
  progressEntries: ProgressEntry[];
  appointments: Appointment[];
  messages: Message[];
  messageThreads: MessageThread[];
  notifications: Notification[];
  webhooks: Webhook[];
}

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
};

export const database = {
  get: <T extends { id: string }>(
    table: keyof Database,
    id: string
  ): T | undefined => {
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
    return newItem;
  },

  update: <T extends { id: string }>(
    table: keyof Database,
    id: string,
    data: Partial<T>
  ): T | null => {
    const tableData = db[table] as T[];
    const itemIndex = tableData.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      const updatedItem = {
        ...tableData[itemIndex],
        ...data,
        updatedAt: new Date(),
      };
      tableData[itemIndex] = updatedItem;
      return updatedItem;
    }
    return null;
  },

  delete: (table: keyof Database, id: string): boolean => {
    const tableData = db[table] as { id: string }[];
    const initialLength = tableData.length;
    db[table] = tableData.filter((item) => item.id !== id) as any;
    return db[table].length < initialLength;
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
    const tableData = db[table] as T[];
    if (!searchTerm) return tableData;

    const lowerSearch = searchTerm.toLowerCase();
    return tableData.filter((item) => {
      return fields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerSearch);
        }
        return false;
      });
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
    const total = items.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = items.slice(start, end);

    return {
      data,
      pagination: { page, limit, total, pages },
    };
  },

  // NEW: Sort helper
  sort: <T extends Record<string, any>>(
    items: T[],
    field: string,
    order: 'asc' | 'desc' = 'asc'
  ): T[] => {
    return [...items].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
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
    };
  },

  init: (seedData: Partial<Database>) => {
    db = {
      ...db,
      ...JSON.parse(JSON.stringify(seedData)),
    };
  },
};

export const initializeDatabase = (seedData: Partial<Database>) => {
  database.init(seedData);
};