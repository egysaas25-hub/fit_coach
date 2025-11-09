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
      title: "Active Clients",
      value: stats.activeClients,
      change: stats.clientGrowth,
      icon: Users,
      trend: "up",
      href: "/admin/clients",
    },
    {
      title: "Renewals Due",
      value: stats.renewalsDue,
      change: -5.2,
      icon: Calendar,
      trend: "down",
      href: "/admin/clients?filter=renewals",
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      change: stats.revenueGrowth,
      icon: DollarSign,
      trend: "up",
      href: "/admin/analytics/business",
    },
    {
      title: "Pending Tickets",
      value: stats.pendingTickets,
      change: -12.5,
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
        <button className="px-4 py Се3 border border-border rounded-lg hover:bg-accent text-left flex items-center gap-3">
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
const ActivityFeed: React.FC = () => {
  const activities = [
    { id: 1, type: "client", message: "Client Alex completed workout", time: "1 hour ago", icon: Users },
    { id: 2, type: "message", message: "Client Jordan logged nutrition", time: "2 hours ago", icon: Send },
    { id: 3, type: "renewal", message: "Client Sarah subscription renewed", time: "3 hours ago", icon: Calendar },
    { id: 4, type: "alert", message: "Client Mike missed check-in", time: "4 hours ago", icon: AlertCircle },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
      <p className="text-sm text-muted-foreground mb-4">Latest client interactions and system events</p>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Alerts Component
const AlertsList: React.FC = () => {
  const alerts = [
    {
      id: 1,
      title: "12 Renewals Due This Week",
      description: "Follow up with clients for subscription renewals",
      severity: "warning",
    },
    {
      id: 2,
      title: "3 Clients Inactive >30 Days",
      description: "Re-engagement campaign recommended",
      severity: "alert",
    },
    {
      id: 3,
      title: "Payment Gateway Issue",
      description: "Stripe integration needs attention",
      severity: "critical",
    },
  ];

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
const AIInsights: React.FC = () => {
  const insights = [
    {
      id: 1,
      title: "Churn Risk Detected",
      description: "5 clients showing low engagement patterns",
      action: "View Details",
    },
    {
      id: 2,
      title: "Revenue Opportunity",
      description: "23 clients eligible for premium upgrade",
      action: "Create Campaign",
    },
    {
      id: 3,
      title: "Trainer Performance",
      description: "Sarah Miller has 95% satisfaction rate",
      action: "View Report",
    },
  ];

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