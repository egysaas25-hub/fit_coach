// lib/store/appointments.store.ts
import { create } from 'zustand';
import { appointmentService } from '@/lib/api/services/appointment.service';
import { AppointmentState } from '@/types/domain/appointment.model';



export const useAppointmentsStore = create<AppointmentState>((set) => ({
  appointments: [],
  fetchAppointments: async (tenantId?: number) => {
    const appointments = await appointmentService.getAll(tenantId);
    set({ appointments });
  },
}));