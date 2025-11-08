import { create } from 'zustand';
import { Client } from '@/types/domain/client.model';

interface ClientState {
  selectedClient: Client | null;
  filters: { status?: string; search?: string };
  setSelectedClient: (client: Client | null) => void;
  setFilters: (filters: { status?: string; search?: string }) => void;
  clearFilters: () => void;
}

export const useClientsStore = create<ClientState>((set) => ({
  selectedClient: null,
  filters: {},
  setSelectedClient: (selectedClient) => set({ selectedClient }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: {} }),
}));