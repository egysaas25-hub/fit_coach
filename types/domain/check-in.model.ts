export enum CheckInStatus {
  COMPLETED = 'completed',
  MISSED = 'missed',
}

export interface CheckIn {
  id: number;
  tenantId: number;
  customerId: string;
  teamMemberId: string;
  status: CheckInStatus;
  notes: string | null;
  checkInDate: Date;
  createdAt: Date;
}