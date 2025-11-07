// types/domain/dashboard.ts
export interface DashboardStats {
  totalUsers: number;
  revenue: number;
  growthRate: number;
  activeSessions: number;
  openTickets: number;
  avgResponseTime: string; // e.g., '2.5h'
}

export interface KPICard {
  title: string;
  value: string | number;
  change: string; // e.g., '+12% from last month'
  icon: string; // e.g., 'Users', 'DollarSign'
}

export interface ActivityFeedItem {
  id: string;
  user: string;
  action: string; // e.g., 'Subscribed to Premium Monthly'
  timestamp: string; // e.g., '2 hours ago'
  details?: string;
}

export interface Alert {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  createdAt: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'engagement' | 'revenue';
  createdAt: string;
}

export interface QuickAction {
  id: string;
  label: string;
  action: string; // e.g., '/admin/workouts/builder'
  icon: string;
}

export interface DashboardState {
  stats: DashboardStats | null;
  feed: ActivityFeedItem[];
  alerts: Alert[];
  insights: AIInsight[];
  actions: QuickAction[];
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchFeed: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchInsights: () => Promise<void>;
  fetchActions: () => Promise<void>;
}