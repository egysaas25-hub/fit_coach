// lib/api/services/dashboard.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { DashboardStats, ActivityFeedItem, Alert, AIInsight, QuickAction } from '@/types/domain/dashboard';
import { ApiResponse } from '@/types/shared/response';

/**
 * Dashboard Service
 * Rule 5: Service calls apiClient (not fetch)
 * Rule 6: Uses endpoints from lib/api/endpoints.ts
 */
export class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<any>>(
      endpoints.admin.analytics.dashboard
    );
    
    // Transform backend response to DashboardStats
    const data = response.data.data;
    return {
      totalUsers: data.overview.totalClients + data.overview.totalTrainers,
      revenue: 0, // TODO: Add revenue calculation in backend
      growthRate: data.growth.clientGrowthRate,
      activeSessions: data.activity.workoutsThisWeek,
      openTickets: 0, // TODO: Add tickets in backend
      avgResponseTime: '0h',
    };
  }

  /**
   * Get client analytics
   */
  async getClientAnalytics(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      endpoints.admin.analytics.clients
    );
    return response.data.data;
  }

  /**
   * Get activity feed
   */
  async getActivityFeed(): Promise<ActivityFeedItem[]> {
    // TODO: Create backend endpoint for activity feed
    // For now, return empty array
    return [];
  }

  /**
   * Get alerts
   */
  async getAlerts(): Promise<Alert[]> {
    // TODO: Create backend endpoint for alerts
    return [];
  }

  /**
   * Get AI insights
   */
  async getAIInsights(): Promise<AIInsight[]> {
    // TODO: Create backend endpoint for AI insights
    return [];
  }

  /**
   * Get quick actions
   */
  async getQuickActions(): Promise<QuickAction[]> {
    // TODO: Create backend endpoint for quick actions
    return [];
  }
}