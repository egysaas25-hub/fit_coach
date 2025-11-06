export enum TeamMemberRole {
  OWNER = 'owner',
  TRAINER = 'trainer',
  ADMIN = 'admin',
}

export interface Trainer {
  id: string;
  tenantId: number;
  firstName: string | null;
  lastName: string | null;
  fullName: string; // Computed
  email: string;
  role: TeamMemberRole;
  createdAt: Date;
  updatedAt: Date;
  initials: string; // Computed
}