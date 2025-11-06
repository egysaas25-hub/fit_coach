// lib/api/services/dashboard.service.ts
import { DashboardStats, ActivityFeedItem, Alert, AIInsight, QuickAction } from '@/types/domain/dashboard';

export class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      return data as DashboardStats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard stats');
    }
  }

  async getActivityFeed(): Promise<ActivityFeedItem[]> {
    try {
      const response = await fetch('/api/dashboard/activity');
      const data = await response.json();
      return data as ActivityFeedItem[];
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      throw new Error('Failed to fetch activity feed');
    }
  }

  async getAlerts(): Promise<Alert[]> {
    try {
      const response = await fetch('/api/dashboard/alerts');
      const data = await response.json();
      return data as Alert[];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw new Error('Failed to fetch alerts');
    }
  }

  async getAIInsights(): Promise<AIInsight[]> {
    try {
      const response = await fetch('/api/dashboard/ai-insights');
      const data = await response.json();
      return data as AIInsight[];
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      throw new Error('Failed to fetch AI insights');
    }
  }

  async getQuickActions(): Promise<QuickAction[]> {
    try {
      const response = await fetch('/api/dashboard/quick-actions');
      const data = await response.json();
      return data as QuickAction[];
    } catch (error) {
      console.error('Error fetching quick actions:', error);
      throw new Error('Failed to fetch quick actions');
    }
  }
}