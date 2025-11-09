// lib/hooks/api/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService, AppointmentListResponse, AppointmentItem } from '../../api/services/appointment.service';

export const useAppointments = (params?: { clientId?: string; trainerId?: string; status?: string; from?: string; to?: string; page?: number; limit?: number }) => {
  return useQuery<AppointmentListResponse>({
    queryKey: ['appointments', params],
    queryFn: () => appointmentService.getAppointments(params),
    staleTime: 60_000,
  });
};

export const useCreateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { clientId: string; trainerId?: string; date: string; duration?: number; type?: string; notes?: string }) => appointmentService.createAppointment(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useUpdateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<AppointmentItem> }) => appointmentService.updateAppointment(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useDeleteAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentService.deleteAppointment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
