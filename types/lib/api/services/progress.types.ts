/**
 * Progress Service Types
 */

export interface ProgressEntry {
  id: string;
  clientId: string;
  metric: string;
  value: number | string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface ProgressData {
  clientId: string;
  total: number;
  byMetric: {
    weight: ProgressEntry[];
    bodyfat: ProgressEntry[];
    measurements: ProgressEntry[];
    photos: ProgressEntry[];
  };
  recent: ProgressEntry[];
}

export interface Activity {
  id: string;
  type: 'workout' | 'nutrition' | 'progress';
  date: string;
  description: string;
  data: any;
}

export interface ActivityData {
  clientId: string;
  activities: Activity[];
  total: number;
  summary: {
    workouts: number;
    nutritionLogs: number;
    progressEntries: number;
  };
}