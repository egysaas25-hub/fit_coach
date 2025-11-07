export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export interface Appointment {
  id: number;
  tenantId: number;
  customerId: string;
  teamMemberId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  duration: number; // Computed: minutes
}

export interface AppointmentState {
  appointments: Appointment[];
  fetchAppointments: (tenantId?: number) => Promise<void>;
}