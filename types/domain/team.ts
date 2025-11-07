// types/domain/team.ts
export interface TeamMember {
  id: string;
  name: string;
  roleId: string;
  email: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string; // e.g., 'Super Admin'
  description: string;
  permissions: string[]; // Permission IDs
  userCount: number;
}

export interface Permission {
  id: string;
  name: string; // e.g., 'View Users'
  category: string; // e.g., 'Users', 'Clients'
  roles: string[]; // Role IDs
}

export interface Team {
  id: string;
  name: string; // e.g., 'Team Alpha'
  memberCount: number;
  revenue: number;
  growth: string; // e.g., '+15%'
  status: 'Active' | 'Inactive';
}

export interface TeamStats {
  teamId: string;
  totalRevenue: number;
  memberCount: number;
  growthRate: string;
}