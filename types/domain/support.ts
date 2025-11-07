// types/domain/support.ts
export interface Ticket {
  id: string;
  subject: string;
  userId: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
}

export enum TicketPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum TicketStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
}

export enum TicketCategory {
  Technical = 'Technical',
  Billing = 'Billing',
  FeatureRequest = 'Feature Request',
  General = 'General',
}

export interface SupportState {
  tickets: Ticket[];
  stats: {
    open: number;
    inProgress: number;
    resolved: number;
    avgResponseTime: string;
  } | null;
  loading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  fetchStats: () => Promise<void>;
}