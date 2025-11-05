export enum UserType {
  TEAM_MEMBER = 'team_member',
  CUSTOMER = 'customer',
}

export interface User {
  id: string;
  tenantId: number;
  type: UserType;
  email: string | null;
  name: string | null;
  initials: string; // Computed
}