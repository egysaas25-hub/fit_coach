export interface AppointmentItem {
  id: string;
  clientId: string;
  trainerId: string;
  date: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  type: 'consultation' | 'training' | 'check-in' | string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentListResponse {
  data: AppointmentItem[];
  pagination: { page: number; limit: number; total: number; pages: number };
}