/**
 * Trainer Service Types
 */

export interface TrainerStats {
  totalClients: number;
  activeSessions: number;
  clientProgress: number;
  revenue: number;
}

export interface TrainerDashboardData {
  stats: TrainerStats;
  recentClients: any[]; // Using any[] since Client is imported from domain types
  recentActivity: Array<{
    id: string;
    clientId: string;
    clientName: string;
    action: string;
    timestamp: string;
    type: string;
  }>;
}