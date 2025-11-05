import { useQuery } from '@tanstack/react-query';
import { Appointment } from '@/types/models/appointment.model';
import { appointmentService } from '@/lib/api/services/appointment.service';
import { QueryFunctionContext } from '@tanstack/react-query';

export const useAppointments = (tenantId?: number) => {
  return useQuery<Appointment[], Error>({
    queryKey: ['appointments', tenantId],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, tenantId] = queryKey;
      return appointmentService.getAll(tenantId as number | undefined);
    },
    enabled: !!tenantId,
  });
};