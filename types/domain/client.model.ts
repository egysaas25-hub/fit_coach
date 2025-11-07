export enum CustomerStatus {
  LEAD = 'lead',
  ACTIVE = 'active',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  CHURNED = 'churned',
  PAID_PENDING_KYC = 'paid_pending_kyc',
  LEAD_INCOMPLETE = 'lead_incomplete',
}

export interface Client {
  id: string;
  tenantId: number;
  firstName: string | null;
  lastName: string | null;
  fullName: string; // Computed
  phone: string;
  status: CustomerStatus;
  goal: string | null;
  createdAt: Date;
  updatedAt: Date;
  initials: string; // Computed
}
export interface ClientState {
  selectedClient: Client | null;
  filters: { status?: string; search?: string };
  setSelectedClient: (client: Client | null) => void;
  setFilters: (filters: { status?: string; search?: string }) => void;
  clearFilters: () => void;
