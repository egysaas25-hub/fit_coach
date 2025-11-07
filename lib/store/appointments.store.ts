// lib/store/appointments.store.ts
import { create } from 'zustand';
import {
  Appointment,
  AppointmentState,
} from '@/types/domain/appointment.model';
import { appointmentService } from '@/lib/api/services/appointment.service';

export const useAppointmentsStore = create<AppointmentState>((set) => ({
  appointments: [],
  fetchAppointments: async (tenantId?: number) => {
    const appointments = await appointmentService.getAll(tenantId);
    set({ appointments });
  },
}));