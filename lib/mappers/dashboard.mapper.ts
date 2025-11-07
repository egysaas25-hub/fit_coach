// lib/mappers/dashboard.mapper.ts
import { DashboardStats, ActivityFeedItem, Alert, AIInsight, QuickAction } from '@/types/domain/dashboard';

interface RawDashboardStats {
  total_users: number;
  revenue: number;
  growth_rate: number;
  active_sessions: number;
  open_tickets: number;
  avg_response_time: string;
}

interface RawActivityFeedItem {
  activity_id: string;
  user: string;
  action: string;
  timestamp: string;
  details?: string;
}

interface RawAlert {
  alert_id: string;
  message: string;
  severity: string;
  created_at: string;
}

interface RawAIInsight {
  insight_id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
}

interface RawQuickAction {
  action_id: string;
  label: string;
  action: string;
  icon: string;
}

export class DashboardMapper {
  static toDomainStats(raw: RawDashboardStats): DashboardStats {
    return {
      totalUsers: raw.total_users,
      revenue: raw.revenue,
      growthRate: raw.growth_rate,
      activeSessions: raw.active_sessions,
      openTickets: raw.open_tickets,
      avgResponseTime: raw.avg_response_time,
    };
  }

  static toDomainActivityFeedItem(raw: RawActivityFeedItem): ActivityFeedItem {
    return {
      id: raw.activity_id,
      user: raw.user,
      action: raw.action,
      timestamp: raw.timestamp,
      details: raw.details,
    };
  }

  static toDomainActivityFeed(rawItems: RawActivityFeedItem[]): ActivityFeedItem[] {
    return rawItems.map(this.toDomainActivityFeedItem);
  }

  static toDomainAlert(raw: RawAlert): Alert {
    return {
      id: raw.alert_id,
      message: raw.message,
      severity: raw.severity as Alert['severity'],
      createdAt: raw.created_at,
    };
  }

  static toDomainAlerts(rawAlerts: RawAlert[]): Alert[] {
    return rawAlerts.map(this.toDomainAlert);
  }

  static toDomainAIInsight(raw: RawAIInsight): AIInsight {
    return {
      id: raw.insight_id,
      title: raw.title,
      description: raw.description,
      category: raw.category as AIInsight['category'],
      createdAt: raw.created_at,
    };
  }

  static toDomainAIInsights(rawInsights: RawAIInsight[]): AIInsight[] {
    return rawInsights.map(this.toDomainAIInsight);
  }

  static toDomainQuickAction(raw: RawQuickAction): QuickAction {
    return {
      id: raw.action_id,
      label: raw.label,
      action: raw.action,
      icon: raw.icon,
    };
  }

  static toDomainQuickActions(rawActions: RawQuickAction[]): QuickAction[] {
    return rawActions.map(this.toDomainQuickAction);
  }
}