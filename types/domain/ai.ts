// types/domain/ai.ts
export interface AITemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AILog {
  id: string;
  templateId?: string;
  prompt: string;
  response: AIResponse;
  status: LogStatus;
  createdAt: string;
}

export interface AIPrompt {
  id: string;
  content: string;
  category: TemplateCategory;
  createdAt: string;
}

export interface AIResponse {
  id: string;
  logId: string;
  content: string; // JSON or text
  generatedAt: string;
}

export enum TemplateCategory {
  Workout = 'Workout',
  Nutrition = 'Nutrition',
  ProgressTracking = 'ProgressTracking',
}

export enum LogStatus {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
}