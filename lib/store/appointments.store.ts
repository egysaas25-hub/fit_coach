// lib/store/appointments.store.ts
import { create } from 'zustand';
import { Appointment } from '@/types/models/appointment.model';
import { appointmentService } from '@/lib/api/services/appointment.service';

interface AppointmentState {
  appointments: Appointment[];
  fetchAppointments: (tenantId?: number) => Promise<void>;
}

export const useAppointmentsStore = create<AppointmentState>((set) => ({
  appointments: [],
  fetchAppointments: async (tenantId?: number) => {
    const appointments = await appointmentService.getAll(tenantId);
    set({ appointments });
  },
}));