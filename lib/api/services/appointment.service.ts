// lib/api/services/appointment.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';

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

export const appointmentService = {
  async getAppointments(params?: { clientId?: string; trainerId?: string; status?: string; from?: string; to?: string; page?: number; limit?: number }): Promise<AppointmentListResponse> {
    const qp = new URLSearchParams();
    if (params?.clientId) qp.append('clientId', params.clientId);
    if (params?.trainerId) qp.append('trainerId', params.trainerId);
    if (params?.status) qp.append('status', params.status);
    if (params?.from) qp.append('from', params.from);
    if (params?.to) qp.append('to', params.to);
    if (params?.page) qp.append('page', String(params.page));
    if (params?.limit) qp.append('limit', String(params.limit));
    const url = `${endpoints.appointment}?${qp.toString()}`;
    const response = await apiClient.get<ApiResponse<AppointmentListResponse>>(url);
    return response.data.data;
  },

  async createAppointment(data: { clientId: string; trainerId?: string; date: string; duration?: number; type?: string; notes?: string }): Promise<AppointmentItem> {
    const response = await apiClient.post<ApiResponse<AppointmentItem>>(endpoints.appointment, data);
    return response.data.data;
  },

  async updateAppointment(id: string, updates: Partial<AppointmentItem>): Promise<AppointmentItem> {
    const response = await apiClient.patch<ApiResponse<AppointmentItem>>(`${endpoints.appointment}/${id}`, updates);
    return response.data.data;
  },

  async deleteAppointment(id: string): Promise<void> {
    await apiClient.delete(`${endpoints.appointment}/${id}`);
  },
};
