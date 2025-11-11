// app/admin/dashboard/page.tsx
'use client';

import { 
  Users, TrendingUp, DollarSign, AlertCircle, UserPlus, 
  FileText, Send, Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { AdminHeader, Tabs, TabsList, TabsTrigger, TabsContent } from './AdminClientComponents';
import { useDashboardStats, useActivityFeed, useAlerts, useAIInsights } from '@/lib/hooks/api/useDashboard';
import { DashboardStats } from '@/types/domain/dashboard';

/**
 * Admin Dashboard Page
 * Follows Architecture Rules:
 * - Rule 1: Component calls hooks only
 * - Uses React Query for server data
 */

// KPI Cards Component
const KPICards: React.FC<{ stats: DashboardStats | undefined }> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-8 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      change: stats.growthRate || 0,
      icon: Users,
      trend: (stats.growthRate || 0) >= 0 ? "up" : "down",
      href: "/admin/clients",
    },
    {
      title: "Active Sessions",
      value: stats.activeSessions || 0,
      change: 0,
      icon: Calendar,
      trend: "up",
      href: "/admin/workouts",
    },
    {
      title: "Revenue",
      value: `$${(stats.revenue || 0).toLocaleString()}`,
      change: 0,
      icon: DollarSign,
      trend: "up",
      href: "/admin/billing",
    },
    {
      title: "Open Tickets",
      value: stats.openTickets || 0,
      change: 0,
      icon: AlertCircle,
      trend: "down",
      href: "/admin/support",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const isPositive = kpi.trend === "up";
        const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

        return (
          <div
            key={kpi.title}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendIcon className={`w-3 h-3 ${isPositive ? "text-primary" : "text-destructive"}`} />
              <span className={`text-xs font-medium ${isPositive ? "text-primary" : "text-destructive"}`}>
                {Math.abs(kpi.change)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last 30 days</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Quick Actions Component
const QuickActions: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
      <p className="text-sm text-muted-foreground mb-4">Common tasks and shortcuts</p>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <button className="px-4 py-3 border border-border rounded-lg hover:bg-accent text-left flex items-center gap-3">
          <UserPlus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Client</span>
        </button>
        <button className="px-4 py-3 border border-border rounded-lg hover:bg-accent text-left flex items-center gap-3">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Assign Plan</span>
        </button>
        <button className="px-4 py-3 border border-border rounded-lg hover:bg-accent text-left flex items-center gap-3">
          <Send className="w-4 h-4" />
          <span className="text-sm font-medium">Send Message</span>
        </button>
        <button className="px-4 py-3 border border-border rounded-lg hover:bg-accent text-left flex items-center gap-3">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">View Reports</span>
        </button>
      </div>
    </div>
  );
};

// Activity Feed Component
const ActivityFeed: React.FC<{ feed: any[] | undefined }> = ({ feed }) => {
  if (!feed || feed.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <p className="text-sm text-muted-foreground mb-4">Latest client interactions and system events</p>
        <div className="text-center py-8 text-muted-foreground">
          No recent activity
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
      <p className="text-sm text-muted-foreground mb-4">Latest client interactions and system events</p>
      <div className="space-y-4">
        {feed.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Alerts Component
const AlertsList: React.FC<{ alerts: any[] | undefined }> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Alerts & Notifications</h2>
        <p className="text-sm text-muted-foreground mb-4">Important updates requiring attention</p>
        <div className="text-center py-8 text-muted-foreground">
          No alerts at this time
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-2">Alerts & Notifications</h2>
      <p className="text-sm text-muted-foreground mb-4">Important updates requiring attention</p>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border ${
              alert.severity === "critical"
                ? "bg-destructive/10 border-destructive/20"
                : alert.severity === "warning"
                  ? "bg-yellow-500/10 border-yellow-500/20"
                  : "bg-primary/10 border-primary/20"
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                className={`w-5 h-5 flex-shrink-0 ${
                  alert.severity === "critical"
                    ? "text-destructive"
                    : alert.severity === "warning"
                      ? "text-yellow-500"
                      : "text-primary"
                }`}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-foreground">{alert.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// AI Insights Component
const AIInsights: React.FC<{ insights: any[] | undefined }> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">AI-Powered Insights</h2>
        <p className="text-sm text-muted-foreground mb-4">Recommendations and predictions</p>
        <div className="text-center py-8 text-muted-foreground">
          No insights available yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-2">AI-Powered Insights</h2>
      <p className="text-sm text-muted-foreground mb-4">Recommendations and predictions</p>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-foreground">{insight.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
              </div>
              <button className="px-3 py-1 text-sm border border-border rounded hover:bg-accent">
                {insight.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function EnhancedAdminDashboard() {
  // Rule 1: Component calls hooks only
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activityFeed } = useActivityFeed();
  const { data: alerts } = useAlerts();
  const { data: insights } = useAIInsights();

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="p-6 lg:p-8 space-y-8">
        {statsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-8 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <KPICards stats={stats} />
        )}
        <QuickActions />
        <Tabs defaultValue="activity">
          <TabsList>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="activity">
            <ActivityFeed feed={activityFeed} />
          </TabsContent>
          <TabsContent value="alerts">
            <AlertsList alerts={alerts} />
          </TabsContent>
          <TabsContent value="insights">
            <AIInsights insights={insights} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}