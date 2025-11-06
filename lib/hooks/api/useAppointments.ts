// hooks/api/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Appointment } from '@/types/models/appointment.model';
import { appointmentService } from '@/lib/api/services/appointment.service';
import { CreateAppointmentDto } from '@/types/api/appointment.dto';

export const useAppointments = () => {
  return useQuery<Appointment[], Error>({
    queryKey: ['appointments'],
    queryFn: appointmentService.getAll,
  });
};

export const useAppointment = (id: number) => {
  return useQuery<Appointment, Error>({
    queryKey: ['appointment', id],
    queryFn: () => appointmentService.getById(id),
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation<Appointment, Error, Partial<Appointment>>({
    mutationFn: appointmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation<Appointment, Error, { id: number; model: Partial<Appointment> }>({
    mutationFn: ({ id, model }) => appointmentService.update(id, model),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
    },
  });
};