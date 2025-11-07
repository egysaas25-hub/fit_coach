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

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, type: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}
