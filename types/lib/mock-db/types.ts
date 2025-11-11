/**
 * Mock Database Types
 */

interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: RoleType;
  passwordHash: string;
}

export interface Client extends User {
  trainerId: string;
}

export interface Trainer extends User {}

export enum RoleType {
  Client = 'client',
  Trainer = 'trainer',
  Admin = 'admin',
  SuperAdmin = 'super-admin',
}

export enum AppointmentStatus {
  Scheduled = 'scheduled',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum ProgressMetric {
  Weight = 'weight',
  Bodyfat = 'bodyfat',
  Measurements = 'measurements',
  Photo = 'photo',
}

export enum WebhookStatus {
  Active = 'active',
  Inactive = 'inactive',
}

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
  metric: ProgressMetric;
  value: number;
  date: Date;
}

export interface Appointment extends BaseEntity {
  clientId: string;
  trainerId: string;
  date: Date;
  status: AppointmentStatus;
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
  status: WebhookStatus;
  secret: string;
}

export interface AuthAttempt extends BaseEntity {
  phone: string;
  countryCode: string;
  success: boolean;
  reason?: string;
}

export interface Session extends BaseEntity {
  userId: string;
  refreshToken: string;
  expiresAt: Date;
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
  authAttempts: AuthAttempt[];
  sessions: Session[];
}